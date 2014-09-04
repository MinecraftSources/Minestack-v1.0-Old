#!/bin/bash

echo "Building Node Controller Image"
docker rmi minestack/nodecontroller
docker build -t="minestack/nodecontroller" .
echo "Finished building Node Controller Image"