#!/usr/bin/env python3
import argparse
import json
import sys
import requests
import pathlib


def post(url, payload):
    r = requests.post(url, json=payload, timeout=60)
    r.raise_for_status()
    return r.json()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("prompt", nargs="?", help="Agentin tehtävä")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--file", help="Kohdetiedosto kun generoidaan yksi muutos")
    ap.add_argument("--api", default="http://127.0.0.1:8000")
    ap.add_argument("--search", help="Semanttinen haku kysely")
    ap.add_argument("-k", type=int, default=5)
    ap.add_argument("--root", default=".")
    ap.add_argument("--reindex", action="store_true")
    args = ap.parse_args()

    if args.search:
        res = requests.get(f"{args.api}/api/v2/search/code",
                           params={"q": args.search, "k": args.k, "root": args.root}, timeout=60).json()
        for i, hit in enumerate(res.get("results", []), 1):
            print(f"{i}. {hit['path']}  score={hit['score']:.3f}")
        sys.exit(0)

    if args.reindex:
        res = requests.post(f"{args.api}/api/v2/search/reindex",
                            params={"root": args.root}, timeout=120).json()
        print(json.dumps(res, indent=2))
        sys.exit(0)

    if args.dry_run:
        if not args.file:
            print("Anna --file kun käytät --dry-run", file=sys.stderr)
            sys.exit(2)
        new_content = pathlib.Path(args.file).read_text(encoding="utf-8")
        out = post(f"{args.api}/api/v2/agent/diff",
                   {"file_path": args.file, "new_content": new_content})
        print(out.get("diff", ""))
        sys.exit(0)

    if args.apply:
        if not args.file:
            print("Anna --file kun käytät --apply", file=sys.stderr)
            sys.exit(2)
        content = sys.stdin.read()
        if not content:
            content = pathlib.Path(args.file).read_text(encoding="utf-8")
        out = post(f"{args.api}/api/v2/agent/apply",
                   {"file_path": args.file, "content": content})
        print(json.dumps(out, indent=2))
        sys.exit(0)

    payload = {
        "goal": args.prompt or "Refaktoroi impact service ja lisää testit",
        "constraints": {"mode": "dry-run"},
    }
    resp = post(f"{args.api}/api/v2/agent/execute", payload)
    print(json.dumps(resp, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()


