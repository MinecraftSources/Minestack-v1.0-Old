#!/bin/python
import os
import sys
from pymongo import MongoClient
from bson.objectid import ObjectId

def main():
    mongoHosts = os.environ['MONGO_HOSTS'].split(',')
    mongoDB = os.environ['MONGO_DB']

    client = MongoClient(mongoHosts)
    db = client[mongoDB]
    servertypesCollection = db['servertypes']
    worldsCollection = db['worlds']
    pluginsCollection = db['plugins']

    query = {"_id": ObjectId(os.environ['SERVER_TYPE'])}

    servertype = servertypesCollection.find_one(query)

    if servertype == None:
        print('No server type found')
        sys.exit(0)

    worlds = []
    plugins = []
    for worldInfo in servertype['worlds']:
        world = worldsCollection.find_one({"_id": worldInfo['_id']})
        default = worldInfo['isDefault']

        worldDict = {'world': world, 'default': default}
        worlds.append(worldDict)
        print('Loaded '+worldDict)

    for pluginInfo in servertype['plugins']:
        plugin = pluginsCollection.find_one({"_id": pluginInfo['_id']})
        pluginConfig = None
        for config in plugin['configs']:
            if config['_id'] == pluginInfo['_configId']:
                pluginConfig = config
                break

        pluginDict = {'plugin': plugin, 'config': pluginConfig}
        plugins.append(pluginDict)
        print('Loaded '+pluginDict)

    for world in worlds:
        print('Loading world '+world['name'])

    for pluginInfo in plugins:
        plugin = pluginInfo['plugin']
        config = pluginInfo['config']
        print('Loading plugin '+plugin['name'] + 'config '+config['name'])

main()