CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION security_alert_notify(p_tenant text, p_kind text, p_count int, p_window_sec int)
RETURNS void AS $$
DECLARE payload json; BEGIN
  payload := json_build_object(
    'tenant_id', p_tenant,
    'kind', p_kind,
    'count', p_count,
    'window_sec', p_window_sec,
    'ts', now()
  );
  PERFORM pg_notify('security_alerts_channel', payload::text);
END; $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION security_burst_check()
RETURNS void AS $$
DECLARE rec record; wnd int := 60; threshold_login int := 10; threshold_denied int := 15; BEGIN
  FOR rec IN SELECT tenant_id, count(*) AS c FROM audits WHERE ts >= now() - make_interval(secs := wnd) AND action = 'login_failure' GROUP BY tenant_id LOOP
    IF rec.c >= threshold_login THEN PERFORM security_alert_notify(rec.tenant_id, 'login_failure_burst', rec.c, wnd); END IF;
  END LOOP;
  FOR rec IN SELECT tenant_id, count(*) AS c FROM audits WHERE ts >= now() - make_interval(secs := wnd) AND action = 'feature_access_denied' GROUP BY tenant_id LOOP
    IF rec.c >= threshold_denied THEN PERFORM security_alert_notify(rec.tenant_id, 'feature_denied_burst', rec.c, wnd); END IF;
  END LOOP;
END; $$ LANGUAGE plpgsql;

SELECT cron.schedule('security_burst_job', '*/1 * * * *', $$SELECT security_burst_check();$$);


