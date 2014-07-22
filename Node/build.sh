#!/bin/bash

echo "Building Node Controller Image"
docker build -t=mn2/nodecontroller -rm=true
echo "Finished building Node Controller Image"