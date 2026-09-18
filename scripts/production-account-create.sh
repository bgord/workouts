#!/usr/bin/env bash

if [ -z "$1" ]; then
  echo "Usage: $0 <email>"
  exit 1
fi

echo "Environment: production"
echo "Creating account..."

export NODE_ENV="production"

cd /var/www/workouts || exit
"$HOME/.bun/bin/bun" scripts/account-create.js "$1"
