#!/bin/python
import os
import sys
import pyrax
from pymongo import MongoClient
from bson.objectid import ObjectId

def modifyConfig(expression, value):
    print('Modifying '+expression+' with value '+str(value))

def main():
    pyrax.set_setting("identity_type", "rackspace")
    pyrax.set_default_region('IAD')
    pyrax.set_credentials(os.environ['RACKSPACE_USERNAME'], os.environ['RACKSPACE_API'])
    cf = pyrax.cloudfiles

    serverContainer = cf.create_container("mn2_server")
    pluginContainer = cf.create_container("mn2_plugins")
    worldsContainer = cf.create_container("mn2_worlds")

    mongoHosts = os.environ['MONGO_HOSTS'].split(',')
    mongoDB = "mn2"

    client = MongoClient(mongoHosts)
    db = client[mongoDB]
    serverCollection = db['servers']
    servertypesCollection = db['servertypes']
    worldsCollection = db['worlds']
    pluginsCollection = db['plugins']

    query = {"_id": ObjectId(os.environ['MY_SERVER_ID'])}

    server = serverCollection.find_one(query)

    query = {"_id": server['_servertype']}

    servertype = servertypesCollection.find_one(query)

    if servertype is None:
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

    print('Downloading Main Server files')
    objects = serverContainer.get_objects()
    for obj in objects:
        if obj.content_type == 'application/directory':
            continue
        print obj.name
        obj.download('./')
    #os.system('ls -l server')

    defaultWorld = None
    os.system('mkdir worlds')
    for worldInfo in worlds:
        world = worldInfo['world']
        default = worldInfo['default']
        if default is True:
            defaultWorld = world
            print('Downloading world '+world['name'])
        objects = worldsContainer.get_objects(prefix=world['folder'])
        for obj in objects:
            if obj.content_type == 'application/directory':
                continue
            print obj.name
            obj.download('worlds')
    #os.system('ls -l worlds')

    if defaultWorld is None:
        print('No default world set')
        sys.exit(0)

    #modify server config for default world
    modifyConfig('level.name', defaultWorld['name'])

    os.system('mkdir plugins')
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
        if config is not None:
            os.system('mv tempPlugins/'+config['location']+' tempPlugins/'+plugin['name']+'/'+plugin['configFolder'])
        #os.system('ls -l tempPlugins/'+plugin['name'])
        os.system('mv tempPlugins/'+plugin['name']+'/* plugins')
    #os.system('rm -rf tempPlugins')
    #os.system('ls -l plugins')

    #modify server config for num of players
    modifyConfig('num.players', servertype['players'])

    os.system('ls -l')
    os.system('sh run.sh '+str(servertype['memory']))

main()