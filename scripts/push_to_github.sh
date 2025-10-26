#!/usr/bin/env bash
set -euo pipefail

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This script must be run from inside a Git repository." >&2
  exit 1
fi

current_branch=$(git rev-parse --abbrev-ref HEAD)

if ! git remote >/dev/null 2>&1 || [ -z "$(git remote)" ]; then
  cat <<'MSG'
No Git remote is currently configured. Add one first:
  git remote add origin https://github.com/<owner>/<repo>.git

Then rerun this script.
MSG
  exit 2
fi

remote=${1:-origin}

if ! git remote get-url "$remote" >/dev/null 2>&1; then
  echo "Remote '$remote' is not defined. Use one of:"
  git remote
  exit 3
fi

echo "Pushing branch '$current_branch' to '$remote'..."
git push "$remote" "$current_branch"
