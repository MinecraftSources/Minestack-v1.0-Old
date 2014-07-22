#!/bin/bash

echo "Building Node Controller Image"
docker rmi mnsquared/nodecontroller
docker build -t="mnsquared/nodecontroller" --rm=true .
echo "Finished building Node Controller Image"