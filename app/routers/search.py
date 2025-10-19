from fastapi import APIRouter, Query
from pydantic import BaseModel
from pathlib import Path
from collections import Counter
import math
from app.telemetry.gamify import track_event
from app.services.index import build_or_load, tokenize

router = APIRouter(prefix="/api/v2/search", tags=["search"])

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


class Hit(BaseModel):
    path: str
    score: float


class SearchOut(BaseModel):
    results: list[Hit]


def score(query_tokens, doc_tokens):
    q = Counter(query_tokens)
    d = Counter(doc_tokens)
    qnorm = math.sqrt(sum(v * v for v in q.values()))
    dnorm = math.sqrt(sum(v * v for v in d.values()))
    if qnorm == 0 or dnorm == 0:
        return 0.0
    dot = sum(q[t] * d.get(t, 0) for t in q)
    return dot / (qnorm * dnorm)


@router.get("/code", response_model=SearchOut)
def code(q: str = Query(...), k: int = 5, root: str = "."):
    idx = build_or_load(root)
    qt = tokenize(q)
    hits: list[Hit] = []
    for path, rec in idx["files"].items():
        txt_tokens = rec.get("top", []) + tokenize(Path(path).name)
        s = score(qt, txt_tokens)
        if s > 0:
            hits.append(Hit(path=path, score=float(s)))
    hits.sort(key=lambda h: h.score, reverse=True)
    track_event("search.code", {"q": q, "k": k, "root": root})
    return SearchOut(results=hits[:k])


class ReindexOut(BaseModel):
    files_indexed: int
    built_at: int


@router.post("/reindex", response_model=ReindexOut)
def reindex(root: str = "."):
    idx = build_or_load(root)
    return ReindexOut(files_indexed=len(idx["files"]), built_at=idx["built_at"])
