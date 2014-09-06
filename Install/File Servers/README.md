File Server Setup
=================

1. Install NFS
    
    ```sh
    sudo yum install nfs-utils nfs-utils-lib
    ```
    
2. Start the NFS service and make sure it starts on boot

    ```sh
    sudo service rpcbind start
    sudo service nfs start
    sudo chkconfig nfs on
    sudo rpcbind on
    ```

3. Export Minestack file shares 

    1. Edit `/etc/exports`
    
        ```
        /minestack/proxy           172.16.0.0/12(ro,sync,no_root_squash,no_subtree_check)
        /minestack/server           172.16.0.0/12(ro,sync,no_root_squash,no_subtree_check)
        /minestack/plugins           172.16.0.0/12(ro,sync,no_root_squash,no_subtree_check)
        /minestack/worlds           172.16.0.0/12(ro,sync,no_root_squash,no_subtree_check)
        ```
    
    2. Create directories
    
        ```sh
        sudo mkdir -p /minestack/proxy
        sudo mkdir -p /minestack/server
        sudo mkdir -p /minestack/plugins
        sudo mkdir -p /minestack/worlds
        ```
    
    3. Export them
    
        ```sh
        sudo exportfs -a
        ```
    
4. Upload proxy, server, plugin and world files

### Bungee Configuration

Upload a "bungee" folder to the `/minestack/proxy` directory and include a start.sh file as seen bellow

```sh
#!/bin/bash
java -XX:MaxPermSize=128M -Xmx$1m -jar BungeeCord.jar
```

Use the config.yml shown bellow. Do NOT change the host, query_port, default_server, fallback_server, connection_throttle, servers or ip_forward settings

```yaml
groups:
  rmb938:
  - admin
disabled_commands:
- disabledcommandhere
player_limit: -1
permissions:
  default:
  - bungeecord.command.server
  - bungeecord.command.list
  admin:
  - bungeecord.command.alert
  - bungeecord.command.end
  - bungeecord.command.ip
  - bungeecord.command.reload
listeners:
- query_port: 25565
  motd: '&1Minestack Powered Network'
  tab_list: GLOBAL_PING
  query_enabled: false
  forced_hosts:
    pvp.md-5.net: pvp
  ping_passthrough: false
  default_server: defaultserver
  bind_local_address: true
  fallback_server: defaultserver
  host: 0.0.0.0:25565
  max_players: 2
  tab_size: 60
  force_default_server: true
timeout: 30000
connection_throttle: -1
servers:
  defaultserver:
    motd: '&1Temp default server this will be removed'
    address: localhost:25577
    restricted: false
ip_forward: true
online_mode: true
```

### Bukkit/Spigot Configuration

Upload a "bukkit" folder to the `/minestack/server` directory (include a .update-lock file if needed) and include a start.sh file as seen bellow

```
#!/bin/bash
java -XX:MaxPermSize=128M -Xmx$1m -jar spigot.jar
```

Use the server.properties shown bellow. Do NOT change the level-name or max players settings

```
#Minecraft server properties
generator-settings=
op-permission-level=4
allow-nether=false
level-name=levelname
enable-query=false
allow-flight=false
announce-player-achievements=false
server-port=25565
level-type=DEFAULT
enable-rcon=false
level-seed=
force-gamemode=false
server-ip=
max-build-height=256
spawn-npcs=false
white-list=false
spawn-animals=false
hardcore=false
snooper-enabled=false
online-mode=false
resource-pack=
pvp=false
difficulty=1
enable-command-block=true
gamemode=2
player-idle-timeout=0
max-players=maxplayers
spawn-monsters=false
generate-structures=false
view-distance=10
motd=A Minecraft Server

```
