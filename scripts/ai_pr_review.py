#!/usr/bin/env python3
"""
AI Pull Request Review using Anthropic Claude Sonnet 3.5.

Reads the PR diff and changed files, asks Claude for a review focusing on
correctness, security, performance, types, and readability, then posts a PR
comment summary.

Required secrets in GitHub Actions:
  - ANTHROPIC_API_KEY
  - GITHUB_TOKEN (automatic)
"""

from __future__ import annotations

import json
import os
import sys
from typing import List

from github import Github

try:
    import anthropic
except Exception:  # pragma: no cover
    anthropic = None


def get_pr_context() -> tuple[str, int]:
    event_path = os.environ.get("GITHUB_EVENT_PATH")
    if not event_path or not os.path.isfile(event_path):
        print("GITHUB_EVENT_PATH not found", file=sys.stderr)
        sys.exit(0)
    with open(event_path, "r", encoding="utf-8") as f:
        event = json.load(f)
    repo = event["repository"]["full_name"]
    pr_number = event["number"]
    return repo, pr_number


def load_diff(g: Github, repo_full: str, pr_number: int) -> tuple[str, List[str]]:
    repo = g.get_repo(repo_full)
    pr = repo.get_pull(pr_number)
    files = pr.get_files()
    changed_paths: List[str] = []
    diff_chunks: List[str] = []
    for f in files:
        changed_paths.append(f.filename)
        # Include patch/diff if available
        if f.patch:
            diff_chunks.append(f"--- {f.filename}\n{f.patch}")
    diff_text = "\n\n".join(diff_chunks)[:150000]  # guard against huge diffs
    return diff_text, changed_paths


def build_prompt(diff_text: str, files: List[str]) -> str:
    return (
        "You are an expert senior code reviewer. Review the following Pull Request diff. "
        "Focus on: correctness, security, performance, type-safety, readability, and tests. "
        "Point out concrete issues with file+line references when possible, suggest minimal diffs, "
        "and flag dangerous patterns. If everything looks good, say so briefly.\n\n"
        f"Changed files: {files}\n\nDiff:\n{diff_text}"
    )


def main() -> None:
    github_token = os.environ.get("GITHUB_TOKEN")
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
    if not github_token or not anthropic_key or not anthropic:
        print("AI review skipped (missing tokens or anthropic lib).", file=sys.stderr)
        return

    repo_full, pr_number = get_pr_context()
    g = Github(github_token)
    diff_text, files = load_diff(g, repo_full, pr_number)
    if not diff_text:
        print("No diff to review.")
        return

    client = anthropic.Anthropic(api_key=anthropic_key)
    prompt = build_prompt(diff_text, files)

    msg = client.messages.create(
        model="claude-3-5-sonnet-20240620",
        max_tokens=2000,
        temperature=0.2,
        messages=[
            {"role": "user", "content": prompt},
        ],
    )
    content = (msg.content[0].text if msg and msg.content else "AI review unavailable.")

    repo = g.get_repo(repo_full)
    pr = repo.get_pull(pr_number)
    pr.create_issue_comment(f"## 🤖 AI Code Review (Claude Sonnet 3.5)\n\n{content}")
    print("AI review posted.")


if __name__ == "__main__":
    main()

