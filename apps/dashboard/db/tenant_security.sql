CREATE TABLE IF NOT EXISTS tenant_security (
  tenant_id TEXT PRIMARY KEY,
  locked_until TIMESTAMPTZ,
  lock_reason TEXT,
  rate_policy TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tenant_security_until ON tenant_security(locked_until);


