Database Node Setup
===================

### Install MongoDB

1. Create a /etc/yum.repos.d/mongodb.repo file to hold the MongoDB Repo configuration bellow
```
[mongodb]
name=MongoDB Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64/
gpgcheck=0
enabled=1
```
2. Install the latest stable version of MongoDB
```
sudo yum install mongodb-org
```
3. Edit MongoDB's configuration file (/etc/mongod.conf) to set the bind IP address to your private IP address.
```
bind_ip=172.16.0.x
```
4. Start MongoDB and tell it to run on system startup
```
sudo service mongod start
sudo chkconfig mongod on
```

### Install RabbitMQ

1. Install Erlang

   1. Install the EPEL Repo
   ```
   wget http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
   sudo rpm -Uvh epel-release-6-8.noarch.rpm
   ```
   
   2. Install Erlang
   ```
   sudo yum install erlang
   ```

2. Install RabbitMQ
    
    1. Import the public key
    ```
    sudo rpm --import http://www.rabbitmq.com/rabbitmq-signing-key-public.asc
    ```
    
    2. Download RabbitMQ
    ```
    wget http://www.rabbitmq.com/releases/rabbitmq-server/v3.3.5/rabbitmq-server-3.3.5-1.noarch.rpm
    ```
    
    3. Install RabbitMQ
    ```
    yum install rabbitmq-server-3.3.5-1.noarch.rpm
    ```

3. Create a default file for rabbitmq /etc/default/rabbitmq-server
```
ulimit -n 65535
```

4. Enable remote management
```
sudo rabbitmq-plugins enable rabbitmq_management
```

5. Start RabbitMQ and tell it to run on system startup
```
sudo service rabbitmq-server start
sudo chkconfig rabbitmq-server on
```

6. Modify IPTables

   1. Find the line number of the first reject statement. 
   ```
   sudo iptables -L INPUT --line-numbers
   ```
   
   2. Insert a new rule before that line
   ```
   sudo iptables -I INPUT yourLineNumber -m state --state NEW -m tcp -p tcp --dport 15672 -j ACCEPT
   ```
   
   3. Save IPTables
   ```
   sudo service iptables save
   ```
   
7. Setup a MongoDB Replicaset and/or RabbitMQ Cluster is desired