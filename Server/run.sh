#!/bin/bash

python setup.py
cat server.properties
ls -l
sh start.sh &
sleep 5
tail logs/latest.log