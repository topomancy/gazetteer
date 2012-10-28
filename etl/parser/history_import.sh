#!/bin/bash

HOST="localhost:9200"
INDEX="gazetteer-history"
API_INDEX=${HOST}/${INDEX}

echo -n "Refreshing gazetteer history... "
curl -s -XDELETE ${API_INDEX} > /dev/null # quash missing index errors
echo
echo "Loading content..."
time find historydump -type f | sort | while read i; do
    echo $i 
    zcat $i | \
        curl -s -X POST --data-binary @- ${HOST}/_bulk >/dev/null
done
