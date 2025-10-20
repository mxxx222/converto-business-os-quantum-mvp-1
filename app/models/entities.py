from sqlalchemy import Column, String, Integer, DateTime, Enum as SAEnum, ForeignKey, Boolean, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum
from shared_core.utils.db import Base


class Role(Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"
    VIEWER = "viewer"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    locale = Column(String, default="fi")
    created_at = Column(DateTime, default=datetime.utcnow)

    memberships = relationship("TenantUser", back_populates="user", cascade="all, delete")


class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    tier = Column(String, default="core")
    stripe_customer_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("TenantUser", back_populates="tenant", cascade="all, delete")


class TenantUser(Base):
    __tablename__ = "tenant_users"

    tenant_id = Column(Integer, ForeignKey("tenants.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    role = Column(SAEnum(Role), nullable=False, default=Role.MEMBER)

    tenant = relationship("Tenant", back_populates="users")
    user = relationship("User", back_populates="memberships")

    __table_args__ = (UniqueConstraint("tenant_id", "user_id", name="uq_tenant_user"),)


class Entitlement(Base):
    __tablename__ = "entitlements"

    id = Column(Integer, primary_key=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"), index=True, nullable=False)
    feature_key = Column(String, index=True, nullable=False)
    enabled = Column(Boolean, default=False)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
