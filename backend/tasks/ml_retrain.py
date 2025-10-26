"""Cron task to materialise OCR training datasets for model refreshes."""

from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import select

from shared_core.modules.ocr.models import OcrResult
from shared_core.utils.db import SessionLocal

LOGGER = logging.getLogger("converto.tasks.ml_retrain")


def _configure_logging() -> None:
    if logging.getLogger().handlers:
        return
    logging.basicConfig(
        level=os.getenv("LOG_LEVEL", "INFO").upper(),
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )


def _export_training_rows(output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    output_file = output_dir / f"ocr-training-{timestamp}.jsonl"

    with SessionLocal() as session, output_file.open("w", encoding="utf-8") as handle:
        result = session.execute(select(OcrResult).order_by(OcrResult.created_at.asc()))
        total = 0
        for row in result.scalars():
            payload = {
                "id": str(row.id),
                "tenant_id": row.tenant_id,
                "device_type": row.device_type,
                "brand_model": row.brand_model,
                "rated_watts": row.rated_watts,
                "peak_watts": row.peak_watts,
                "voltage_v": row.voltage_v,
                "current_a": row.current_a,
                "hours_input": row.hours_input,
                "wh": row.wh,
                "confidence": row.confidence,
                "source": row.source,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            }
            handle.write(json.dumps(payload, default=str))
            handle.write("\n")
            total += 1

    LOGGER.info("Exported %s OCR samples", total)
    return output_file


def main() -> None:
    _configure_logging()
    output_dir = Path(os.getenv("ML_DATA_DIR", "./data/ml"))
    artifact = _export_training_rows(output_dir)
    LOGGER.info("Training dataset materialised", extra={"path": str(artifact)})


if __name__ == "__main__":
    main()

