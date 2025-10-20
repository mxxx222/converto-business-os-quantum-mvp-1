#!/usr/bin/env python3
"""
Optional AI autofix pre-commit hook.

Usage: pre-commit passes staged filenames. If OPENAI_API_KEY is set, this script
will attempt conservative autofixes for small text files (<50KB). It is intended
to complement ruff --fix/black, not replace them.
"""

from __future__ import annotations

import os
import sys
from typing import Iterable, List

PROMPT = (
    "You are a code linter/fixer. Fix obvious issues (unused imports, formatting, simple type hints) "
    "without changing behavior. Return ONLY the corrected file content, no explanations."
)


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

    paths: List[str] = [p for p in argv if p.endswith(('.py', '.ts', '.tsx'))]
    if not paths:
        return 0

    try:
        from openai import OpenAI  # type: ignore
        client = OpenAI()
    except Exception:
        return 0

    for path in paths:
        try:
            if not is_text_file(path):
                continue
            if os.path.getsize(path) > 50_000:
                continue
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            # Skip empty
            if not content.strip():
                continue
            # Ask model for minimal corrections
            resp = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": f"{PROMPT}\n\n```\n{content}\n```"}],
                max_tokens=2000,
                temperature=0.0,
            )
            fixed = resp.choices[0].message.content or ""
            # Strip code fences if present
            if fixed.startswith("```"):
                fixed = fixed.strip().strip('`')
                fixed = fixed.split('\n', 1)[-1]
            if fixed and fixed != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(fixed)
        except Exception:
            # Best-effort; ignore failures
            continue

    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

