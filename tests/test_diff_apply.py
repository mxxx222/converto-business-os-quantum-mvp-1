from app.routers.agent import create_diff, apply_change, DiffIn, ApplyIn
from pathlib import Path


def test_diff_and_apply(tmp_path):
    f = tmp_path / "a.txt"
    f.write_text("old\n", encoding="utf-8")
    diff = create_diff(DiffIn(file_path=str(f), new_content="new\n")).diff
    assert "---" in diff and "+++" in diff
    out = apply_change(ApplyIn(file_path=str(f), content="new\n"))
    assert out.written == len("new\n".encode("utf-8"))
    assert Path(str(f) + ".bak").exists()
