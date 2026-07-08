#!/usr/bin/env bash

echo "Environment: production"

PROJECT_NAME=$1
LOBBYGOW_API_KEY=$2
CURRENT_TIME=$(date +%F-%H-%M-%S)

BACKUPS_PATH="/var/backups/$PROJECT_NAME"

DATABASE_PATH="/var/www/$PROJECT_NAME/sqlite.db"
DATABASE_BACKUP_PATH="$BACKUPS_PATH/$CURRENT_TIME.sqlite.backup"

JOBS_PATH="/var/www/$PROJECT_NAME/jobs.db"
JOBS_BACKUP_PATH="$BACKUPS_PATH/$CURRENT_TIME.jobs.backup"

STORAGE_DIR="/var/www/$PROJECT_NAME/infra/storage"
STORAGE_ARCHIVE_PATH="$BACKUPS_PATH/$CURRENT_TIME.storage.tar.gz"

trap 'catch $? $LINENO' ERR

catch() {
  http POST https://lobbygow.bgord.space/api/notification-send \
    kind="error" \
    subject="[$PROJECT_NAME] production server backup error" \
    content="Error occurred on $2 with status code $1" \
    api-key:"$LOBBYGOW_API_KEY"
  exit 1
}

echo "Creating a database backup: $DATABASE_PATH"
sqlite3 "$DATABASE_PATH" ".backup $DATABASE_BACKUP_PATH"
echo "Database backup created to: $DATABASE_BACKUP_PATH"

tar -czf "$DATABASE_BACKUP_PATH.tar.gz" "$DATABASE_BACKUP_PATH"
echo "Database backup compressed"
rm "$DATABASE_BACKUP_PATH"

echo "Creating a jobs backup: $JOBS_PATH"
sqlite3 "$JOBS_PATH" ".backup $JOBS_BACKUP_PATH"
echo "Jobs backup created to: $JOBS_BACKUP_PATH"

tar -czf "$JOBS_BACKUP_PATH.tar.gz" "$JOBS_BACKUP_PATH"
echo "Jobs backup compressed"
rm "$JOBS_BACKUP_PATH"

echo "Archiving storage from: $STORAGE_DIR"
tar -czf "$STORAGE_ARCHIVE_PATH" -C "$STORAGE_DIR" .
echo "Storage archived to: $STORAGE_ARCHIVE_PATH"

find "$BACKUPS_PATH" -mtime +7 -exec rm {} \;
echo "Backups older than 7 days deleted"
