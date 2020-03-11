#!/bin/bash

COUCHDB_HOSTNAME=$1
COUCHDB_USER=$2
COUCHDB_PASS=$3

function main() {
  echo "Checking hostname..."

  HTTP_CODE=$(\
    curl --user "$COUCHDB_USER":"$COUCHDB_PASS" --write-out %{http_code} --silent --get --output /dev/null \
    http://"$COUCHDB_HOSTNAME":5984/ \
  )

  if [ "$HTTP_CODE" -eq '200' ]; then
    post_data_to_database "pwc-projects" "data/test_diagrams/projects.json"
    post_data_to_database "pwc-diagrams" "data/test_diagrams/diagrams.json"
    post_data_to_database "pwc-diagraminfos" "data/test_diagrams/diagramsinfos.json"

  else
    >&2 echo "ERROR: Failed to connect!"
  fi
}

function post_data_to_database() {
  curl --user "$COUCHDB_USER":"$COUCHDB_PASS" \
    --data @"$2" -H "Content-Type: application/json" \
    -X POST http://"$COUCHDB_HOSTNAME":5984/"$1"/_bulk_docs
}

main
