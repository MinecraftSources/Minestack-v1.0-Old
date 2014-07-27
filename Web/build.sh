#!/bin/bash

echo "Building Web Image"
docker rmi mnsquared/web
docker build -t="mnsquared/web" .
echo "Finished building Web Image"