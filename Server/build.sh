#!/bin/bash

echo "Building Server Image"
docker rmi minestack/server
docker build -t="mnsquared/server" .
echo "Finished building Server Image"