## Converto™ Business OS – Quantum Edition (MVP+)

### Quick Start
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
bash scripts/setup.sh
```

- Backend: http://127.0.0.1:8000/api/v1/impact/summary
- Frontend: http://127.0.0.1:3000
- Logs: /tmp/converto_backend.log, /tmp/converto_frontend.log

### Modules
- /api/v1/impact/summary
- /api/v1/quantum/status
- /api/v1/ai/guardian/review
- /api/v1/sentinel/anomaly?score=0.07
- /api/v1/predictive/forecast?days=14

Notes:
- MVP endpoints are implemented and wired into `app/main.py`.
- Use the setup script for a one-command local run (starts backend and frontend, writes logs).


