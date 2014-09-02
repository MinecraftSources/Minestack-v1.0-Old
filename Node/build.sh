#!/bin/bash

echo "Building Node Controller Image"
docker rmi minestack/nodecontroller
docker build -t="mnsquared/nodecontroller" .
echo "Finished building Node Controller Image"