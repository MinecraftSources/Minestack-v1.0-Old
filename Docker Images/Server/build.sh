#!/bin/bash

echo "Building Server Image"
docker rmi minestack/server
docker build -t="minestack/server" .
echo "Finished building Server Image"