#!/bin/bash

echo "Building Bungee Image"
docker rmi minestack/bungee
docker build -t="mnsquared/bungee" .
echo "Finished building Bungee Image"