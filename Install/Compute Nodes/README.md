Compute Node Setup
==================

### NFS Client

1. Install NFS

    ```sh
    sudo yum install nfs-utils nfs-utils-lib
    ```
    
2. Make mounting directories

    ```sh
    mkdir -p /mnt/minestack/proxy
    mkdir -p /mnt/minestack/server
    mkdir -p /mnt/minestack/plugins
    mkdir -p /mnt/minestack/worlds
    ```
    
3. Setup mounts. Edit `/etc/fstab` and make sure your replace the IP address with your file server address

    ```
    172.16.0.x:/minestack/proxy        /mnt/minestack/proxy     nfs     auto,fsc,noatime,nolock,fg,nfsvers=3,intr,tcp,actimeo=1800 0 0
    172.16.0.x:/minestack/server        /mnt/minestack/server     nfs     auto,fsc,noatime,nolock,fg,nfsvers=3,intr,tcp,actimeo=1800 0 0
    172.16.0.x:/minestack/plugins        /mnt/minestack/plugins     nfs     auto,fsc,noatime,nolock,fg,nfsvers=3,intr,tcp,actimeo=1800 0 0
    172.16.0.x:/minestack/worlds        /mnt/minestack/worlds     nfs     auto,fsc,noatime,nolock,fg,nfsvers=3,intr,tcp,actimeo=1800 0 0
    ```
    
4. Mount everything

    ```sh
    sudo mount -a
    ```
    
5. Check the mounts.

    ```sh
    sudo df -h
    ```

### Docker

1. Install Docker dependencies

    ```sh
    sudo yum install libX11 libX11-common libXau libxcb libcgroup
    ```
    
2. Setup cgroup mounts

    ```sh
    sudo chkconfig cgconfig on
    sudo service cgconfig start
    ```
    
3. Download and Install docker

    ```sh
    wget https://get.docker.io/builds/Linux/x86_64/docker-latest -O docker
    sudo mv docker /usr/bin/docker
    sudo chmod +x /usr/bin/docker
    ```
    
4. Edit docker's config file `/etc/sysconfig/docker` and replace the IP address with this node's address

    ```
    other_args="--iptables=true --icc=true --ip='172.16.0.x' -H unix:///var/run/docker.sock -H tcp://0.0.0.0:4243"
    ```
    
5. Setup docker's service

    ```sh
    wget https://raw.githubusercontent.com/docker/docker/master/contrib/init/sysvinit-redhat/docker
    sudo mv docker /etc/init.d/docker
    chmod +x /etc/init.d/docker
    sudo chkconfig docker on
    sudo service docker start
    ```
    
6. Install Minestack Docker Images

  1. Download this git repo
  
    ```sh
    git clone https://github.com/Minestack/Minestack.git
    ```
    
  2. Upload a copy of the Redstone jar to `Minestack/Docker Images/Node`
  
  3. Change to each image directory and run `build.sh` for each image

    ```sh
    sudo sh build.sh
    ```