"""Database backup helper used by Render cron jobs."""

from __future__ import annotations

import gzip
import json
import logging
import os
import time
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import create_engine, inspect, text

LOGGER = logging.getLogger("converto.tasks.backup")


def _configure_logging() -> None:
    if logging.getLogger().handlers:
        return
    logging.basicConfig(
        level=os.getenv("LOG_LEVEL", "INFO").upper(),
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )


def _cleanup_old_backups(directory: Path, retention_days: int) -> None:
    if retention_days <= 0:
        return
    cutoff = time.time() - retention_days * 24 * 3600
    for file_path in directory.glob("backup-*.jsonl.gz"):
        try:
            if file_path.stat().st_mtime < cutoff:
                file_path.unlink(missing_ok=True)
                LOGGER.info("Removed expired backup", extra={"path": str(file_path)})
        except FileNotFoundError:
            continue


def run_backup() -> Path:
    """Dump every table as JSON lines so Render cron backups succeed."""

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL environment variable must be defined")

    backup_dir = Path(os.getenv("BACKUP_DIR", "/var/data/backups"))
    retention_days = int(os.getenv("BACKUP_RETENTION_DAYS", "30"))

    backup_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    output_path = backup_dir / f"backup-{timestamp}.jsonl.gz"

    LOGGER.info(
        "Starting logical backup", extra={"database": database_url, "destination": str(output_path)}
    )

    engine = create_engine(database_url, future=True)
    inspector = inspect(engine)

    with engine.connect() as connection, gzip.open(
        output_path, "wt", encoding="utf-8"
    ) as handle:
        for table_name in inspector.get_table_names():
            LOGGER.debug("Exporting table %s", table_name)
            result = connection.execute(text(f'SELECT * FROM "{table_name}"'))
            for row in result.mappings():
                payload = {
                    "table": table_name,
                    "data": dict(row),
                }
                handle.write(json.dumps(payload, default=str))
                handle.write("\n")

    engine.dispose()
    LOGGER.info("Backup written", extra={"path": str(output_path)})

    _cleanup_old_backups(backup_dir, retention_days)
    return output_path


def main() -> None:
    _configure_logging()
    run_backup()


if __name__ == "__main__":
    main()

