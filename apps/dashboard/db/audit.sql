CREATE TABLE IF NOT EXISTS audits (
  id BIGSERIAL PRIMARY KEY,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id TEXT,
  tenant_id TEXT,
  action TEXT NOT NULL,
  resource TEXT,
  outcome TEXT NOT NULL,
  ip INET,
  user_agent TEXT,
  meta JSONB DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_audits_ts ON audits(ts DESC);
CREATE INDEX IF NOT EXISTS idx_audits_tenant ON audits(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audits_action ON audits(action);


