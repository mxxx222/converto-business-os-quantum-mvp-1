import json
import time


def track_event(event: str, meta: Optional[dict] = None):
    payload = {"event": event, "meta": meta or {}, "ts": int(time.time())}
    print("[gamify]", json.dumps(payload))


