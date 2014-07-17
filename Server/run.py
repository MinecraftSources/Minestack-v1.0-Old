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

    plugins = {}
    worlds = {}
    for worldId in servertype['worlds']:
        print(worldId)

    for pluginId in servertype['plugins']:
        print(pluginId)

main()