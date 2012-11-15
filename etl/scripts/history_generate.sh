#!/bin/bash

echo "Converting dumps"
time find dump -type f | sort | while read i; do
    echo $i 
    python ../parser/history.py $i 'historydump' 'gazetteer'
done
