from datetime import datetime
from enum import Enum
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum as SAEnum, JSON, Boolean
from shared_core.utils.db import Base


class PlanKey(str, Enum):
    CORE = "core"
    PRO = "pro"
    ENTERPRISE = "enterprise"


class Plan(Base):
    __tablename__ = "plans"

    key = Column(String, primary_key=True)  # matches PlanKey
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    TRIALING = "trialing"
    PAST_DUE = "past_due"
    CANCELED = "canceled"


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), index=True, nullable=False)
    plan_key = Column(String, ForeignKey("plans.key"), nullable=False)
    status = Column(SAEnum(SubscriptionStatus), default=SubscriptionStatus.ACTIVE, nullable=False)
    current_period_end = Column(DateTime, nullable=True)
    stripe_subscription_id = Column(String, nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AddonPurchase(Base):
    __tablename__ = "addon_purchases"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), index=True, nullable=False)
    feature_key = Column(String, index=True, nullable=False)  # e.g. "addon.ocr", "addon.legal_ai"
    enabled = Column(Boolean, default=True)
    price_id = Column(String, nullable=True)  # Stripe price id
    provider_item_id = Column(String, nullable=True)  # Stripe subscription item id
    quantity = Column(Integer, default=1)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)


class StripeCustomer(Base):
    __tablename__ = "stripe_customers"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), index=True, nullable=False)
    customer_id = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class StripeEventAudit(Base):
    __tablename__ = "stripe_event_audit"

    id = Column(Integer, primary_key=True)
    event_id = Column(String, unique=True, index=True, nullable=False)
    event_type = Column(String, index=True, nullable=False)
    payload_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    succeeded = Column(Boolean, default=False)
    error = Column(String, nullable=True)
