#!/usr/bin/env bash

if [[ -z "$1" ]]; then
  echo "Usage: $0 <email>"
  exit 1
fi

echo "Environment: production"
echo "Creating account..."

cd /var/www/workouts || exit
sudo -H -u workouts env NODE_ENV=production /opt/bun/bin/bun scripts/account-create.js "$1"
