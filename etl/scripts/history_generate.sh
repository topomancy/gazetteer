#!/bin/bash

echo "Converting dumps"
time find dump -type f | sort | while read i; do
    echo $i 
    python history.py $i 'history' 'gazetteer'
done
