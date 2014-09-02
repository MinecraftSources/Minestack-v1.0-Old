#!/bin/python
import os
import sys
from pymongo import MongoClient
from bson.objectid import ObjectId

def modifyConfig(expression, value):
    print('Modifying '+expression+' with value '+str(value))
    os.system("sed -i 's/"+str(expression)+"/"+str(value)+"/' config.yml")

def main():

    mongoHosts = os.environ['MONGO_HOSTS'].split(',')
    mongoDB = "mn2"

    client = MongoClient(mongoHosts)
    db = client[mongoDB]
    bungeeCollection = db['bungees']
    bungeetypesCollection = db['bungeetypes']
    pluginsCollection = db['plugins']

    query = {"_id": ObjectId(os.environ['MY_BUNGEE_ID'])}

    bungee = bungeeCollection.find_one(query)

    query = {"_id": bungee['_bungeetype']}

    bungeetype = bungeetypesCollection.find_one(query)

    if bungeetype is None:
        print('No bungee type found')
        sys.exit(0)

    plugins = []

    for pluginInfo in bungeetype['plugins']:
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

    print('Copying Main Bungee files')
    os.system('cp -R /mnt/minestack/bungee/* .')

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
        os.system('cp -R /mnt/minestack/plugins/'+plugin['baseFolder']+'/* tempPlugins/'+plugin['name'])
        if config is not None:
            os.system('mv tempPlugins/'+config['location']+' tempPlugins/'+plugin['name']+'/'+plugin['configFolder'])
        os.system('mv tempPlugins/'+plugin['name']+'/* plugins')
    os.system('ls -l plugins')

    defaultServer = None
    for serverinfo in bungeetype['servertypes']:
        if serverinfo['isDefault']:
            defaultServer = serverinfo
            break

    if defaultServer is not None:
        modifyConfig("defaultserver", defaultServer['_id'])
    else:
        print('No default server found')
        sys.exit(0)

    os.system('touch start.sh')
    os.system("echo '#!/bin/bash' >> start.sh")
    os.system("echo 'java -XX:MaxPermSize=128M -Xmx1024m -jar BungeeCord.jar' >> start.sh")

    os.system('ls -l')
main()