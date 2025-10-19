import hashlib
from typing import List, Optional
from sqlalchemy.orm import Session
from datetime import date
from app.modules.legal.models import LegalRule


def add_rule(db: Session, rule_data: dict) -> LegalRule:
    """Add or update a legal rule."""
    checksum = hashlib.sha256(rule_data.get("summary", "").encode()).hexdigest()

    # Check if rule already exists
    existing = db.query(LegalRule).filter_by(checksum=checksum).first()
    if existing:
        return existing

    rule = LegalRule(
        id=rule_data.get("id", f"rule_{checksum[:8]}"),
        domain=rule_data["domain"],
        regulation_code=rule_data["regulation_code"],
        title=rule_data["title"],
        summary=rule_data.get("summary"),
        valid_from=rule_data.get("valid_from", date.today()),
        valid_to=rule_data.get("valid_to"),
        source_url=rule_data.get("source_url"),
        ai_guideline=rule_data.get("ai_guideline"),
        checksum=checksum,
        is_active=False,  # Pending by default
        notes=rule_data.get("notes"),
    )

    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule


def list_rules(
    db: Session, domain: Optional[str] = None, active_only: bool = True
) -> List[LegalRule]:
    """List legal rules, optionally filtered by domain."""
    q = db.query(LegalRule)
    if domain:
        q = q.filter_by(domain=domain)
    if active_only:
        q = q.filter_by(is_active=True)
    return q.order_by(LegalRule.valid_from.desc()).all()


def promote_rule(db: Session, rule_id: str) -> Optional[LegalRule]:
    """Activate a pending legal rule."""
    rule = db.query(LegalRule).filter_by(id=rule_id).first()
    if rule:
        rule.is_active = True
        db.commit()
        db.refresh(rule)
    return rule


def get_rule(db: Session, rule_id: str) -> Optional[LegalRule]:
    """Get a specific legal rule."""
    return db.query(LegalRule).filter_by(id=rule_id).first()
