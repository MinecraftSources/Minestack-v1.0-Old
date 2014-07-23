#!/bin/python
import os
import sys
import pyrax
from pymongo import MongoClient
from bson.objectid import ObjectId

def main():
    pyrax.set_setting("identity_type", "rackspace")
    pyrax.set_default_region('IAD')
    pyrax.set_credentials(os.environ['RACKSPACE_USERNAME'], os.environ['RACKSPACE_API'])
    cf = pyrax.cloudfiles

    pluginContainer = cf.create_container("mn2_plugins")
    worldsContainer = cf.create_container("mn2_worlds")

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
        print('Loaded '+world['name'])

    for pluginInfo in servertype['plugins']:
        plugin = pluginsCollection.find_one({"_id": pluginInfo['_id']})
        pluginConfig = None
        for config in plugin['configs']:
            if config['_id'] == pluginInfo['_configId']:
                pluginConfig = config
                break

        pluginDict = {'plugin': plugin, 'config': pluginConfig}
        plugins.append(pluginDict)
        print('Loaded '+plugin['name']+' '+pluginConfig['name'])

    for worldInfo in worlds:
        world = worldInfo['world']
        default = worldInfo['default']
        print('Loading world '+world['name'])

    for pluginInfo in plugins:
        plugin = pluginInfo['plugin']
        config = pluginInfo['config']
        subdirs = pluginContainer.get_objects(prefix=plugin['baseFolder'])
        for obj in subdirs:
            print obj.content_type
            print obj.name
        print('Loading plugin '+plugin['name'] + 'config '+config['name'])

main()