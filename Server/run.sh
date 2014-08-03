#!/bin/bash

python -u setup.py
sleep 10
java -XX:MaxPermSize=128M -Xmx512m -jar spigot.jar