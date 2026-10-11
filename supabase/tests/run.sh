#!/usr/bin/env bash
# Verifies schema.sql applies cleanly AND that the RLS policies really isolate
# tenants. Runs against a throwaway LOCAL postgres database — it never touches
# your Supabase project.
#
#   ./supabase/tests/run.sh
#
# Needs a local postgres running (brew services start postgresql).
set -euo pipefail

DB=icse_schema_check
HERE="$(cd "$(dirname "$0")" && pwd)"

psql -d postgres -qc "drop database if exists $DB;"
psql -d postgres -qc "create database $DB;"
psql -d "$DB" -q -v ON_ERROR_STOP=1 -f "$HERE/local_supabase_stub.sql"
psql -d "$DB" -q -v ON_ERROR_STOP=1 -f "$HERE/../schema.sql"
# Then every migration, in filename order, so this matches what is actually
# deployed rather than just the original schema.
for m in "$HERE"/../migrations/*.sql; do
  [ -e "$m" ] || continue
  psql -d "$DB" -q -v ON_ERROR_STOP=1 -f "$m"
  echo "applied $(basename "$m")"
done
echo "schema + migrations applied cleanly"
psql -d "$DB" -v ON_ERROR_STOP=1 -f "$HERE/rls_test.sql" 2>&1 | grep -E "^(OK|ERROR|=====| ALL)"
psql -d postgres -qc "drop database if exists $DB;"
