from pathlib import Path
import json
import time
import hashlib
from collections import Counter
import re


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


def tokenize(text: str):
    # Extract alphanumeric tokens (keeps letters and digits, drops punctuation)
    return [t.lower() for t in re.findall(r"[A-Za-z0-9]+", text)]


def file_sig(p: Path) -> str:
    st = p.stat()
    return f"{int(st.st_mtime)}:{st.st_size}"


def build_or_load(root: str = "."):
    rootp = Path(root)
    idx_path = rootp / INDEX_FILE
    idx = {"version": 1, "built_at": int(time.time()), "files": {}}
    if idx_path.exists():
        try:
            idx = json.loads(idx_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            pass
    changed = False
    for p in rootp.rglob("*"):
        if not p.is_file() or p.suffix not in CODE_EXT:
            continue
        sig = file_sig(p)
        rec = idx["files"].get(str(p))
        if not rec or rec.get("sig") != sig:
            try:
                txt = p.read_text(encoding="utf-8", errors="ignore")
            except (OSError, UnicodeDecodeError):
                continue
            tokens = tokenize(txt + " " + p.name)
            idx["files"][str(p)] = {
                "sig": sig,
                "len": len(tokens),
                "hash": hashlib.sha1(txt.encode("utf-8", "ignore")).hexdigest(),
                "top": [w for w, _ in Counter(tokens).most_common(50)],
            }
            changed = True
    if changed:
        idx["built_at"] = int(time.time())
        idx_path.write_text(json.dumps(idx, ensure_ascii=False), encoding="utf-8")
    return idx
