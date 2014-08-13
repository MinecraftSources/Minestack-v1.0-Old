#!/bin/bash

echo "Building Bungee Image"
docker rmi mnsquared/bungee
docker build -t="mnsquared/bungee" .
echo "Finished building Bungee Image"