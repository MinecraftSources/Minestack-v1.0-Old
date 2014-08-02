#!/bin/bash

python setup.py
cat server.properties
ls -l
(sh start.sh &) >> /dev/null
sleep 5
tail -f logs/latest.log