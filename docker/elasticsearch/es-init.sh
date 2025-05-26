#!/bin/bash

set -e

INIT_MARKER="/usr/share/elasticsearch/data/.initialized"

# Exit if already initialized
if [ -f "$INIT_MARKER" ]; then
  echo "Elasticsearch already initialized. Skipping setup."
  exit 0
fi

# Wait for elasticsearch to start
echo "Waiting for elasticsearch to start..."
until curl -k -s -u elastic:$ELASTIC_PASSWORD "https://elasticsearch:9200" > /dev/null; do
  sleep 3
done

echo "Elasticsearch is up and running."

# Disable disk allocation threshold
curl -k -u "elastic:$ELASTIC_PASSWORD" -X PUT "https://elasticsearch:9200/_cluster/settings" -H "Content-Type: application/json" -d '{"persistent":{"cluster.routing.allocation.disk.threshold_enabled":false}}'

echo "Disk allocation threshold disabled."

# Set kibana_system user password
curl -k -u "elastic:$ELASTIC_PASSWORD" -X POST "https://elasticsearch:9200/_security/user/kibana_system/_password" -H "Content-Type: application/json" -d "{\"password\":\"$KIBANA_PASSWORD\"}"

echo "kibana_system user password set."

# Mark initialization as complete
if touch "$INIT_MARKER"; then
  echo "Initialization complete. Marker file created at $INIT_MARKER"
else
  echo "ERROR: Failed to create initialization marker at $INIT_MARKER" >&2
fi