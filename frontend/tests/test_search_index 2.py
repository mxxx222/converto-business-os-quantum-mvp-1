from pathlib import Path

from app.routers.search import code
from app.services.index import build_or_load


def test_index_and_search(tmp_path: Path) -> None:
    p = tmp_path / "x.py"
    p.write_text("def foo(): pass", encoding="utf-8")
    build_or_load(str(tmp_path))
    res = code(q="foo", k=3, root=str(tmp_path))
    assert any("x.py" in h.path for h in res.results)
