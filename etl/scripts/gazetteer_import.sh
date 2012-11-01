#!/bin/bash

HOST="localhost:9200"
INDEX="gaztest2"
TYPE="place"
DUMP=${1:-dump}

API=${HOST}/${INDEX}

echo -n "Refreshing gazetteer... "
curl -s -XDELETE ${API} > /dev/null # quash missing index errors
curl -s -XPOST -d @mapping/place_mapping.json ${API}
echo
echo "Loading content..."
time find ${DUMP} -type f | sort | while read i; do
    echo $i 
    zcat $i | \
        curl -s -X POST --data-binary @- ${API}/${TYPE}/_bulk >/dev/null
done
