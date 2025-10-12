from datetime import datetime, date
from sqlalchemy import Column, String, Date, Boolean, Text, JSON, DateTime
from shared_core.utils.db import Base

class LegalRule(Base):
    __tablename__ = "legal_rules"
    
    id = Column(String, primary_key=True)
    domain = Column(String, index=True, nullable=False)  # Tax, Employment, DataProtection, etc.
    regulation_code = Column(String, nullable=False)  # ALV §3, Työsopimuslaki 2:2
    title = Column(String, nullable=False)
    summary = Column(Text)
    valid_from = Column(Date, nullable=False)
    valid_to = Column(Date, nullable=True)
    source_url = Column(String)
    ai_guideline = Column(JSON)  # Instructions for AI interpretation
    checksum = Column(String(64))
    is_active = Column(Boolean, default=False, index=True)
    last_checked = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text)
    
    def __repr__(self):
        return f"<LegalRule {self.domain} {self.regulation_code}>"

