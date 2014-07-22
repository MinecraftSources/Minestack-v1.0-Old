#!/bin/bash

echo "Building Node Controller Image"
docker build -t="mnsquared/nodecontroller" --rm=true .
echo "Finished building Node Controller Image"