"""
Standalone Backup API
Automated backups, health monitoring, and data integrity
"""

import os
import glob
import subprocess
from datetime import datetime
from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from shared_core.utils.db import engine


router = APIRouter(prefix="/api/v1/standalone", tags=["standalone"])


@router.post("/backup/run")
def run_backup():
    """
    Trigger manual backup

    Runs the backup script and returns output
    """
    try:
        result = subprocess.run(
            ["bash", "-c", "./scripts/cron_backup.sh"],
            capture_output=True,
            text=True,
            timeout=600,
            cwd=os.getcwd(),
        )

        if result.returncode == 0:
            return {"status": "ok", "log": result.stdout, "timestamp": datetime.now().isoformat()}
        else:
            return {
                "status": "error",
                "log": result.stdout + "\n" + result.stderr,
                "returncode": result.returncode,
            }

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Backup timeout (>10min)")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backup failed: {str(e)}")


@router.get("/backup/latest")
def latest_backup():
    """
    Get latest backup file info

    Returns info about the most recent backup
    """
    bk_dir = os.getenv("BACKUP_DIR", "./backups")

    if not os.path.exists(bk_dir):
        return {"exists": False, "message": "Backup directory not found"}

    files = sorted(glob.glob(os.path.join(bk_dir, "converto-backup-*.zip")))

    if not files:
        return {"exists": False, "message": "No backups found"}

    latest_file = files[-1]
    stat = os.stat(latest_file)

    return {
        "exists": True,
        "file": os.path.basename(latest_file),
        "path": latest_file,
        "size_bytes": stat.st_size,
        "size_mb": round(stat.st_size / 1024 / 1024, 2),
        "created_at": int(stat.st_mtime),
        "age_hours": round((datetime.now().timestamp() - stat.st_mtime) / 3600, 1),
    }


@router.get("/backup/list")
def list_backups():
    """
    List all available backups

    Returns list of backup files with metadata
    """
    bk_dir = os.getenv("BACKUP_DIR", "./backups")

    if not os.path.exists(bk_dir):
        return {"backups": [], "count": 0}

    files = sorted(glob.glob(os.path.join(bk_dir, "converto-backup-*.zip")), reverse=True)

    backups = []
    for f in files:
        stat = os.stat(f)
        backups.append(
            {
                "file": os.path.basename(f),
                "size_mb": round(stat.st_size / 1024 / 1024, 2),
                "created_at": int(stat.st_mtime),
                "age_hours": round((datetime.now().timestamp() - stat.st_mtime) / 3600, 1),
            }
        )

    return {
        "backups": backups,
        "count": len(backups),
        "total_size_mb": round(sum(b["size_mb"] for b in backups), 2),
    }


@router.get("/health")
def data_health():
    """
    Get data health status

    Returns:
    - Database metrics (counts)
    - Backup status
    - Health warnings
    """
    metrics = {}

    # Database metrics
    try:
        with engine.connect() as conn:
            queries = {
                "receipts": "SELECT COUNT(*) FROM ocr_results WHERE 1=1",
                "invoices": "SELECT COUNT(*) FROM invoices WHERE 1=1",
                "legal_rules": "SELECT COUNT(*) FROM legal_rules WHERE 1=1",
                "vat_rates": "SELECT COUNT(*) FROM vat_rates WHERE status='active'",
                "gamify_events": "SELECT COUNT(*) FROM gamify_events WHERE created_at >= NOW() - INTERVAL '7 days'",
                "users": "SELECT COUNT(*) FROM users WHERE 1=1",
            }

            for key, query in queries.items():
                try:
                    # Try PostgreSQL syntax first
                    result = conn.execute(text(query))
                    metrics[key] = result.scalar() or 0
                except Exception:
                    # Fallback for SQLite (no NOW() or INTERVAL)
                    if "NOW()" in query:
                        query = query.replace(
                            "NOW() - INTERVAL '7 days'", "datetime('now', '-7 days')"
                        )
                    try:
                        result = conn.execute(text(query))
                        metrics[key] = result.scalar() or 0
                    except Exception:
                        metrics[key] = 0

    except Exception as e:
        metrics["error"] = str(e)

    # Backup status
    backup_info = latest_backup()

    # Health check
    status = "ok"
    notes = []

    if not backup_info.get("exists"):
        status = "warn"
        notes.append("⚠️ Ei varmuuskopioita. Suorita ensimmäinen backup.")
    elif backup_info.get("age_hours", 0) > 36:
        status = "warn"
        notes.append(f"⚠️ Viimeisin backup {backup_info['age_hours']}h vanha (>36h)")

    if metrics.get("receipts", 0) == 0 and metrics.get("invoices", 0) == 0:
        notes.append("💡 Ei vielä dataa. Aloita skannaamalla ensimmäinen kuitti.")

    return {
        "status": status,
        "metrics": metrics,
        "last_backup": backup_info if backup_info.get("exists") else None,
        "notes": notes,
        "checked_at": datetime.now().isoformat(),
    }


@router.get("/integrity")
def check_integrity():
    """
    Check data integrity

    Verifies:
    - Database connectivity
    - File storage accessibility
    - Backup directory writability
    """
    checks = {}

    # Database check
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        checks["database"] = {"status": "ok", "message": "Database accessible"}
    except Exception as e:
        checks["database"] = {"status": "error", "message": str(e)}

    # Storage check
    storage_dir = os.getenv("STORAGE_DIR", "./storage")
    if os.path.exists(storage_dir) and os.path.isdir(storage_dir):
        checks["storage"] = {"status": "ok", "path": storage_dir}
    else:
        checks["storage"] = {"status": "warn", "message": "Storage directory not found"}

    # Backup directory check
    backup_dir = os.getenv("BACKUP_DIR", "./backups")
    if os.path.exists(backup_dir) and os.access(backup_dir, os.W_OK):
        checks["backup_dir"] = {"status": "ok", "path": backup_dir}
    else:
        checks["backup_dir"] = {"status": "error", "message": "Backup directory not writable"}

    # Overall status
    all_ok = all(c.get("status") == "ok" for c in checks.values())

    return {
        "overall": "ok" if all_ok else "degraded",
        "checks": checks,
        "checked_at": datetime.now().isoformat(),
    }
