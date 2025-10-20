CREATE OR REPLACE FUNCTION audits_notify_fn() RETURNS trigger AS $$
DECLARE
  payload json;
BEGIN
  payload = json_build_object(
    'ts', NEW.ts,
    'user_id', NEW.user_id,
    'tenant_id', NEW.tenant_id,
    'action', NEW.action,
    'resource', NEW.resource,
    'outcome', NEW.outcome,
    'ip', NEW.ip,
    'user_agent', NEW.user_agent,
    'meta', COALESCE(NEW.meta, '{}'::json)
  );
  PERFORM pg_notify('audits_channel', payload::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audits_notify_trigger ON audits;
CREATE TRIGGER audits_notify_trigger
AFTER INSERT ON audits
FOR EACH ROW
EXECUTE FUNCTION audits_notify_fn();


