from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import difflib
from pathlib import Path
from app.telemetry.gamify import track_event

router = APIRouter(prefix="/api/v2/agent", tags=["agent"])

class DiffIn(BaseModel):
    file_path: str
    new_content: str

class DiffOut(BaseModel):
    diff: str

@router.post("/diff", response_model=DiffOut)
def create_diff(body: DiffIn):
    p = Path(body.file_path)
    old = p.read_text(encoding="utf-8") if p.exists() else ""
    diff_lines = difflib.unified_diff(
        old.splitlines(keepends=True),
        body.new_content.splitlines(keepends=True),
        fromfile=body.file_path + " (old)",
        tofile=body.file_path + " (new)",
        n=3,
    )
    diff_text = "".join(diff_lines)
    track_event("agent.diff.dry_run", {"file": body.file_path})
    return DiffOut(diff=diff_text)


class ApplyIn(BaseModel):
    file_path: str
    content: str


class ApplyOut(BaseModel):
    written: int
    backup: str | None


@router.post("/apply", response_model=ApplyOut)
def apply_change(body: ApplyIn):
    p = Path(body.file_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    backup_path: Path | None = None
    tmp_path = p.with_suffix(p.suffix + ".tmp")
    try:
        tmp_path.write_text(body.content, encoding="utf-8")
        if p.exists():
            backup_path = p.with_suffix(p.suffix + ".bak")
            p.replace(backup_path)
        tmp_path.replace(p)
    except OSError as e:
        # Attempt to restore original if moved
        try:
            if tmp_path.exists():
                tmp_path.unlink()
            if backup_path and backup_path.exists() and not p.exists():
                backup_path.replace(p)
        except OSError:
            pass
        raise HTTPException(status_code=500, detail=str(e)) from e
    track_event("agent.apply", {"file": body.file_path, "backup": backup_path is not None})
    return ApplyOut(written=len(body.content.encode("utf-8")), backup=str(backup_path) if backup_path else None)
