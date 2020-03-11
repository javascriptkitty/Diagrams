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
    create_database "_global_changes"
    create_database "_replicator"
    create_database "_users"

    create_database "pwc-diagraminfos"
    create_index "pwc-diagraminfos" "projectId"

    create_database "pwc-diagrams"
    create_database "pwc-projects"

    create_database "pwc-reports"
    create_index "pwc-reports" "projectId"
    create_index "pwc-reports" "generatedAt"

    create_database "pwc-reportresults"
    create_index "pwc-reportresults" "reportId"
    create_index "pwc-reportresults" "amount"
    create_index "pwc-reportresults" "diagramId"
    create_index "pwc-reportresults" "date"
    create_index_multiple_2 "pwc-reportresults" "reportId" "date"
  else
    >&2 echo "ERROR: Failed to connect!"
  fi
}

function create_database() {
  HTTP_CODE=$(\
    curl --user "$COUCHDB_USER":"$COUCHDB_PASS" --head --write-out %{http_code} --silent --output /dev/null \
    http://"$COUCHDB_HOSTNAME":5984/"$1" \
  )

  if [ "$HTTP_CODE" -eq "404" ]; then
    echo "Creating $1..."

    curl --user "$COUCHDB_USER":"$COUCHDB_PASS" --silent --output /dev/null -X PUT http://"$COUCHDB_HOSTNAME":5984/"$1"
  fi
}

function create_index() {
  INDEX_DOC="{\"type\": \"json\", \"name\": \"$2-index\", \"index\": {\"fields\": [\"$2\"]}}"

  curl --user "$COUCHDB_USER":"$COUCHDB_PASS" -X POST \
    -H "Content-Type: application/json" -d "$INDEX_DOC" http://"$COUCHDB_HOSTNAME":5984/"$1"/_index
}

function create_index_multiple_2() {
  INDEX_DOC="{\"type\": \"json\", \"name\": \"$2-$3-index\", \"index\": {\"fields\": [\"$2\", \"$3\"]}}"

  curl --user "$COUCHDB_USER":"$COUCHDB_PASS" -X POST \
    -H "Content-Type: application/json" -d "$INDEX_DOC" http://"$COUCHDB_HOSTNAME":5984/"$1"/_index
}


main
