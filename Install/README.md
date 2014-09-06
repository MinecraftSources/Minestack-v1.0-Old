Node Setup
==========

These instructions assume your nodes are located on OVH's network please adjust as needed for other configurations

1. Setup your nodes with OVH.
   * Nodes must be installed with Centos 6.5 with the stock kernel
   * Nodes must be in the same vRack

2. Update the system
    
   1. Check and install updates
   ```
   sudo yum update
   ```
   
   2. Reboot
   ```
   sudo reboot
   ```

3. Configure a private IP address for all your nodes.
```
/etc/sysconfig/network-scripts/ifcfg-eth1
DEVICE=eth1
BOOTPROTO=static
IPADDR=172.16.0.x
NETMASK=255.240.0.0
ONBOOT=yes 
```

4. Bring up interface eth1
```
sudo ifup eth1
```

5. Configure IPTables to allow all traffic going over the private network

   1. Find the line number of the first reject statement. 
   ```
   sudo iptables -L INPUT --line-numbers
   ```

   2. Insert a new rule before that line
   ```
   sudo iptables -I INPUT yourLineNumber -i eth1 -m state --state NEW -m tcp -p tcp -j ACCEPT
   ```

   3. Save IPTables
   ```
   sudo service iptables save
   ```

6. Install Kernel 3.10

   1. Install ELRepo
   ```
   sudo rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
   ```
   ```
   sudo rpm -Uvh http://www.elrepo.org/elrepo-release-6-6.el6.elrepo.noarch.rpm
   ```
   
   2. Install the Kernel
   ```
   sudo yum --enablerepo=elrepo-kernel install kernel-lt
   ```
   
   3. Edit grub /boot/grub/grub.conf and change the default to the newly install kernel
   
7. Reboot
```
sudo reboot
```

8. Continue to the node specific installation guides