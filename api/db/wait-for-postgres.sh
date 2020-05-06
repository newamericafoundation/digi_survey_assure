#!/bin/sh
# wait-for-postgres.sh

if [ "$#" -ne 0 ]
then
  echo "Wait for Postgres instance to be ready to run migrations and nodejs."
  exit 1
fi

set -e

retries=5

until PGPASSWORD=$PGPASSWORD psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -c '\q' || [ $retries -eq 0 ]; do
  >&2 echo "Waiting for postgres server at $PGDATABASE:$PGHOST, $((retries)) remaining attempts..."
  retries=$((retries-=1))
  sleep 2
done

if [ $retries -eq 0 ];
then
    >&2 echo "Reached max number of retries trying to connect to postgres server at $host:5432. Exiting."
    exit 1
fi

>&2 echo "Postgres is up!"

>&2 echo "Running postinstall process"

npm run postinstall

>&2 echo "Running npm start"

exec npm start
