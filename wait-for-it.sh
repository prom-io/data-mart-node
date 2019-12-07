#!/bin/sh
# wait-for-postgres.sh

set -e

host="$1"
shift
cmd="$@"

until curl http://$host:9200 >/dev/null; do
  >&2 echo "Elastic is unavailable - sleeping"
  sleep 1
done

>&2 echo "Elastic is up - executing command"
exec $cmd