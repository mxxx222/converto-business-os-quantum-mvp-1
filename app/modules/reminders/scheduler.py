"""
Reminder Scheduler
Background task that runs reminder jobs
"""

import threading
import time
from datetime import datetime
from . import service


def start_scheduler(interval_seconds: int = 60):
    """
    Start background scheduler thread

    Args:
        interval_seconds: How often to check for due jobs (default: 60s)
    """

    def _tick():
        print(f"[Reminders] Scheduler started (interval: {interval_seconds}s)")

        while True:
            try:
                now = datetime.now()
                executed = service.run_due_jobs()

                if executed:
                    print(
                        f"[Reminders] {now.isoformat()} - Executed {len(executed)} jobs: {executed}"
                    )

            except Exception as e:
                print(f"[Reminders] Error in scheduler: {e}")

            time.sleep(interval_seconds)

    # Start daemon thread
    thread = threading.Thread(target=_tick, daemon=True)
    thread.start()

    return thread
