#!/usr/bin/env bash

source bgord-scripts/base.sh
setup_base_config

export NODE_ENV="local"
export DATABASE_PATH="sqlite.e2e.db"

info "Environment: e2e (local adapters, $DATABASE_PATH)"

./bgord-scripts/db-reset.sh
./bgord-scripts/db-seed-local.sh
./bgord-scripts/web-build-bun.sh

step_start "Server start e2e"
bun run \
  --env-file=".env.$NODE_ENV" \
  index.ts
step_end "Server start e2e"
