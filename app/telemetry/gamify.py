import json
import time


def track_event(event: str, meta: dict | None = None):
    payload = {"event": event, "meta": meta or {}, "ts": int(time.time())}
    print("[gamify]", json.dumps(payload))


