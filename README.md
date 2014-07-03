MN2-Docker
==========

Multi-Node Minecraft Network using CoreOS and Docker

Each CoreOS system must have a publicly resolvable hostname set
OR a custom dns server to resolve

A MongoDB replica set and RabbitMQ Cluster is required for true High Availability
Using GlusterFS is highly recommended for storage
    
Minecraft Images:

    docker pull rmb938/bungee-nfs
    docker pull rmb938/spigot-nfs
    
For GlusterFS storage use:
(A GlusterFS server should NOT be run inside a docker container)

    docker pull rmb938/bungee-gfs
    docker pull rmb938/spigot-gfs
    
