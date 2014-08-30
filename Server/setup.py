#!/bin/python
import os
import sys
from pymongo import MongoClient
from bson.objectid import ObjectId

def modifyConfig(expression, value):
    print('Modifying '+expression+' with value '+str(value))
    os.system("sed -i 's/"+str(expression)+"/"+str(value)+"/' server.properties")

def main():

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
        #if pluginConfig is None:
        #    print('Loaded '+plugin['name']+' no config')
        #else:
        #    print('Loaded '+plugin['name']+' with config '+pluginConfig['name'])

    print('Copying Main Server files')
    os.system('cp -R /mnt/nfs/mn2/server/* .')

    defaultWorld = None
    os.system('mkdir worlds')
    for worldInfo in worlds:
        world = worldInfo['world']
        default = worldInfo['default']
        print('Copying world '+world['name'])
        if default is True:
            defaultWorld = world
        os.system('cp -R /mnt/nfs/mn2/worlds/'+world['folder']+' worlds/')
    os.system('ls -l worlds')

    if defaultWorld is None:
        print('No default world set')
        sys.exit(0)

    #modify server config for default world
    modifyConfig('levelname', defaultWorld['name'])

    os.system('mkdir plugins')
    os.system('mkdir tempPlugins')
    for pluginInfo in plugins:
        plugin = pluginInfo['plugin']
        config = pluginInfo['config']
        print('Copying plugin '+plugin['name'])
        #if config is None:
        #    print('Downloading plugin '+plugin['name'] + ' no configs')
        #else:
        #    print('Downloading plugin '+plugin['name'] + ' config '+config['name'])

        os.system('mkdir tempPlugins/'+plugin['name'])
        os.system('cp -R /mnt/nfs/mn2/plugins/'+plugin['baseFolder']+'/* tempPlugins/'+plugin['name'])
        if config is not None:
            os.system('mv tempPlugins/'+config['location']+' tempPlugins/'+plugin['name']+'/'+plugin['configFolder'])
        os.system('mv tempPlugins/'+plugin['name']+'/* plugins')
    os.system('ls -l plugins')

    #modify server config for num of players
    modifyConfig('maxplayers', servertype['players'])

    os.system('touch .update-lock')
    os.system('touch start.sh')
    os.system("echo '#!/bin/bash' >> start.sh")
    os.system("echo 'java -XX:MaxPermSize=128M -Xmx"+str(servertype['memory'])+"m -jar spigot.jar' >> start.sh")

    os.system('ls -l')
main()