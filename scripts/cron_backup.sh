#!/usr/bin/env bash
set -euo pipefail

# Automatic backup script for Converto Business OS
# Runs nightly to create DB dump + file archive

# Load environment variables if .env exists
[ -f ".env" ] && set -a && . ./.env && set +a

TS="$(date +%Y%m%d-%H%M%S)"
BK_DIR="${BACKUP_DIR:-./backups}"
STORAGE_DIR="${STORAGE_DIR:-./storage}"
DB_URL="${DATABASE_URL:-sqlite:///./converto.db}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔄 CONVERTO BACKUP - $(date '+%Y-%m-%d %H:%M:%S')"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create directories
mkdir -p "$BK_DIR/tmp" "$BK_DIR"

# 1) Database dump
echo "📦 Creating database dump..."
if [[ "$DB_URL" == sqlite:* ]]; then
  DB_PATH="$(echo "$DB_URL" | sed 's#sqlite:///##')"
  if [ -f "$DB_PATH" ]; then
    cp "$DB_PATH" "$BK_DIR/tmp/db-$TS.sqlite"
    echo "✅ SQLite database backed up"
  else
    echo "⚠️  SQLite database not found at $DB_PATH"
  fi
else
  # PostgreSQL
  if command -v pg_dump &> /dev/null; then
    pg_dump "$DB_URL" > "$BK_DIR/tmp/db-$TS.sql"
    echo "✅ PostgreSQL database dumped"
  else
    echo "⚠️  pg_dump not found, skipping PostgreSQL backup"
  fi
fi

# 2) Storage files (receipts, documents, etc.)
echo "📁 Archiving storage files..."
if [ -d "$STORAGE_DIR" ]; then
  tar -C "$STORAGE_DIR" -czf "$BK_DIR/tmp/storage-$TS.tgz" . 2>/dev/null || true
  echo "✅ Storage files archived"
else
  echo "⚠️  Storage directory not found at $STORAGE_DIR"
fi

# 3) Create metadata
echo "📝 Creating metadata..."
cat > "$BK_DIR/tmp/meta.json" << EOF
{
  "backup_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "timestamp": "$TS",
  "version": "2.0.0",
  "database_engine": "$(echo $DB_URL | cut -d: -f1)",
  "retention_days": $RETENTION_DAYS
}
EOF

# 4) Create final ZIP
echo "🗜️  Creating backup archive..."
ZIP="$BK_DIR/converto-backup-$TS.zip"
cd "$BK_DIR/tmp"
zip -rq "$ZIP" ./* 2>/dev/null || zip -r "$ZIP" ./*
cd - >/dev/null

# 5) Cleanup temporary files
rm -rf "$BK_DIR/tmp"

# 6) Apply retention policy
echo "🧹 Applying retention policy (${RETENTION_DAYS} days)..."
find "$BK_DIR" -type f -name "converto-backup-*.zip" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true

# 7) Report
SIZE=$(ls -lh "$ZIP" | awk '{print $5}')
COUNT=$(ls -1 "$BK_DIR"/converto-backup-*.zip 2>/dev/null | wc -l | xargs)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ BACKUP COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 File: $ZIP"
echo "💾 Size: $SIZE"
echo "📊 Total backups: $COUNT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
