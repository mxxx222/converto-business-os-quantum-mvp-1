import contextlib
import hashlib
import json
import re
import time
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List

CODE_EXT = {
    ".py",
    ".ts",
    ".tsx",
    ".js",
    ".java",
    ".kt",
    ".go",
    ".rs",
    ".cs",
    ".cpp",
    ".c",
    ".md",
    ".yaml",
    ".yml",
    ".toml",
}
INDEX_FILE = ".agent_index.json"


def tokenize(text: str) -> List[str]:
    """Extract alphanumeric tokens (keeps letters and digits, drops punctuation)."""
    return [t.lower() for t in re.findall(r"[A-Za-z0-9]+", text)]


def file_sig(p: Path) -> str:
    """Generate file signature from modification time and size."""
    st = p.stat()
    return f"{int(st.st_mtime)}:{st.st_size}"


def build_or_load(root: str = ".") -> Dict[str, Any]:
    """Build or load search index for code files."""
    rootp = Path(root)
    idx_path = rootp / INDEX_FILE
    idx: Dict[str, Any] = {"version": 1, "built_at": int(time.time()), "files": {}}
    if idx_path.exists():
        with contextlib.suppress(OSError, json.JSONDecodeError):
            loaded = json.loads(idx_path.read_text(encoding="utf-8"))
            if isinstance(loaded, dict):
                idx = loaded
    changed = False
    files_dict: Dict[str, Any] = idx.get("files", {}) if isinstance(idx.get("files"), dict) else {}
    for p in rootp.rglob("*"):
        if not p.is_file() or p.suffix not in CODE_EXT:
            continue
        sig = file_sig(p)
        path_str = str(p)
        rec = files_dict.get(path_str)
        if not rec or (isinstance(rec, dict) and rec.get("sig") != sig):
            try:
                txt = p.read_text(encoding="utf-8", errors="ignore")
            except (OSError, UnicodeDecodeError):
                continue
            tokens = tokenize(txt + " " + p.name)
            files_dict[path_str] = {
                "sig": sig,
                "len": len(tokens),
                "hash": hashlib.sha1(txt.encode("utf-8", "ignore")).hexdigest(),
                "top": [w for w, _ in Counter(tokens).most_common(50)],
            }
            changed = True
    idx["files"] = files_dict
    if changed:
        idx["built_at"] = int(time.time())
        idx_path.write_text(json.dumps(idx, ensure_ascii=False), encoding="utf-8")
    return idx
