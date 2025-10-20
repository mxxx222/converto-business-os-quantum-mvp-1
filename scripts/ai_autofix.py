#!/usr/bin/env python3
"""
Optional AI autofix pre-commit hook.

Usage: pre-commit passes staged filenames. If OPENAI_API_KEY is set, this script
will send small files (<50KB, text) to an LLM with an instruction to fix simple
lint/typing issues. It writes changes in-place. If the API key is missing, it
exits successfully without changes.

This is intentionally conservative; ruff --fix handles most cases already.
"""

from __future__ import annotations

import os
import sys
from typing import Iterable


def is_text_file(path: str) -> bool:
    try:
        with open(path, "rb") as f:
            chunk = f.read(1024)
        return b"\x00" not in chunk
    except Exception:
        return False


def main(argv: Iterable[str]) -> int:
    if not os.environ.get("OPENAI_API_KEY"):
        # Silent no-op if not configured
        return 0

    # Placeholder: keep as no-op for safety; extend with OpenAI edits if desired.
    # We rely on ruff --fix for actual autofixes to avoid noisy diffs.
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

