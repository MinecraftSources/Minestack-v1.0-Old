#!/bin/bash

python -u setup.py
sh start.sh &
sleep 5
tail -f logs/latest.log