#!/bin/bash

#sh history_generate.sh index_name 

defaultindex="gaztest2"

INDEX=${1:-$defaultindex}

echo "Converting dumps"
time find dump -type f | sort | while read i; do
    echo $i 
    python ../parser/history.py $i 'historydump' ${INDEX}
done
