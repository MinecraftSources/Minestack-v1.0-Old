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

    os.system('mkdir server')
    print('Downloading Main Server files')

    os.system('mkdir server/worlds')
    for worldInfo in worlds:
        world = worldInfo['world']
        default = worldInfo['default']
        print('Loading world '+world['name'])
    os.system('ls -l server/worlds')

    os.system('mkdir server/plugins')
    os.system('mkdir tempPlugins')
    for pluginInfo in plugins:
        plugin = pluginInfo['plugin']
        config = pluginInfo['config']
        print('Downloading plugin '+plugin['name'] + ' config '+config['name'])
        objects = pluginContainer.get_objects(prefix=plugin['baseFolder'])
        for obj in objects:
            if obj.content_type == 'application/directory':
                continue
            obj.download('tempPlugins')
        os.system('mv tempPlugins/'+config['location']+' tempPlugins/'+plugin['name']+'/'+plugin['configFolder'])
        os.system('ls -l tempPlugins/'+plugin['name'])
        os.system('mv tempPlugins/'+plugin['name']+'/* server/plugins')
    os.system('ls -l server/plugins')
    os.system('ls -l server')
main()