Node Setup
==========

These instructions assume your nodes are located on OVH's network please adjust as needed for other configurations

1. Setup your nodes with OVH.
   * Nodes must be installed with Centos 6.5 with the stock kernel
   * Nodes must be in the same vRack
2. Update the system
  1. Check and install updates
  
    ```sh
    sudo yum update
    ```
    
  2. Reboot
    
    ```sh
    sudo reboot
    ```
    
3. Install git

    ```sh
    sudo yum install git
    ```
    
4. Edit eth1's configuration file to create a private network `/etc/sysconfig/network-scripts/ifcfg-eth1`

    ```
    DEVICE=eth1
    BOOTPROTO=static
    IPADDR=172.16.0.x
    NETMASK=255.240.0.0
    ONBOOT=yes 
    ```

5. Bring up interface eth1

    ```sh
    sudo ifup eth1
    ```

6. Configure IPTables to allow all traffic going over the private network
  1. Find the line number of the first reject statement. 
  
      ```sh
      sudo iptables -L INPUT --line-numbers
      ```
      
   2. Insert a new rule before that line
   
      ```sh
      sudo iptables -I INPUT yourLineNumber -i eth1 -m state --state NEW -m tcp -p tcp -j ACCEPT
      ```
      
   3. Save IPTables
   
      ```sh
      sudo service iptables save
      ```
      
7. Install Kernel 3.10
   1. Install ELRepo
   
      ```sh
      sudo rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
      ```
      
      ```sh
      sudo rpm -Uvh http://www.elrepo.org/elrepo-release-6-6.el6.elrepo.noarch.rpm
      ```
      
  2. Install the Kernel
  
      ```sh
      sudo yum --enablerepo=elrepo-kernel install kernel-lt
      ```
      
   3. Edit grub `/boot/grub/grub.conf` and change the default to the newly install kernel 
8. Reboot

    ```sh
    sudo reboot
    ```
    
9. Continue to the node specific installation guides