from pathlib import Path

from app.routers.agent import ApplyIn, DiffIn, apply_change, create_diff


def test_diff_and_apply(tmp_path: Path) -> None:
    f = tmp_path / "a.txt"
    f.write_text("old\n", encoding="utf-8")
    diff = create_diff(DiffIn(file_path=str(f), new_content="new\n")).diff
    assert "---" in diff and "+++" in diff
    out = apply_change(ApplyIn(file_path=str(f), content="new\n"))
    assert out.written == len(b"new\n")
    assert (f.with_suffix('.bak')).exists()
