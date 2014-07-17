#!/bin/python
import os
import sys
from pymongo import MongoClient

def main():
    mongoHosts = os.environ['MONGO_HOSTS'].split(',')
    mongoDB = os.environ['MONGO_DB']

    client = MongoClient(mongoHosts)
    db = client[mongoDB]
    servertypesCollection = db['servertypes']
    worldsCollection = db['worlds']
    pluginsCollection = db['plugins']

    query = {"local.name": os.environ['SERVER_TYPE']}

    servertype = servertypesCollection.find_one(query)

    if servertype == None:
        print('none found')
        sys.exit(0)

    worlds = []
    plugins = []
    for worldId in servertype['worlds']:
        world = worldsCollection.find_one({"_id": worldId})
        worlds.append(world)

    for pluginId in servertype['plugins']:
        plugin = pluginsCollection.find_one({"_id": pluginId})
        plugins.append(plugin)

    for world in worlds:
        print('Loading world '+world['name'])

    for plugin in plugins:
        print('Loading plugin '+plugin['name'])

main()