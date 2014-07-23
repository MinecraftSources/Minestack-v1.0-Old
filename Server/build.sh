#!/bin/bash

echo "Building Server Image"
docker rmi mnsquared/server
docker build -t="mnsquared/server" .
echo "Finished building Server Image"