FROM centos:centos7
MAINTAINER Jodie Belgrave

# General Stuff
RUN yum -y install wget
RUN wget http://mirror.us.leaseweb.net/epel/beta/7/x86_64/epel-release-7-0.2.noarch.rpm
RUN rpm -Uvh epel-release-7-0.2.noarch.rpm
RUN yum -y update

# Install Java
RUN wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u11-b12/jdk-8u11-linux-x64.rpm
RUN rpm -Uvh jdk-8u11-linux-x64.rpm

# Environment Variables
ENV MONGO_HOSTS "10.1.42.1"
ENV MONGO_DB "mn2"

ENV RABBITMQ_HOSTS "10.1.42.1"
ENV RABBITMQ_USERNAME "guest"
ENV RABBITMQ_PASSWORD "guest"

# Copy Jar File
ADD MN2NodeController.jar /MN2NodeController.jar

# Run
CMD["java -jar /MN2NodeController.jar"]