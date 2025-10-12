from __future__ import annotations
from typing import Sequence

class Notifier:
    def __init__(self, channels: Sequence[str] | None = None):
        self.channels = list(channels or ["log"])  # log, slack, whatsapp, signal (stubs)

    def send(self, message: str, level: str = "info") -> dict:
        # Stub: return payload only
        return {"sent": True, "level": level, "channels": self.channels, "message": message}



