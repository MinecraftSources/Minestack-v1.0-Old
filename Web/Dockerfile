FROM centos:centos6
MAINTAINER Jodie Belgrave

# General Stuff
RUN yum -y install wget
RUN wget http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
RUN rpm -Uvh epel-release-6-8.noarch.rpm
RUN yum -y update

#Install NodeJS
RUN yum -y --enablerepo=centosplus install npm

# Environment Variables
ENV MONGO_HOSTS 10.1.42.1
ENV MONGO_DB mn2

ENV RABBITMQ_HOSTS 10.1.42.1
ENV RABBITMQ_USERNAME guest
ENV RABBITMQ_PASSWORD guest

ENV RACKSPACE_USERNAME NULL
ENV RACKSPACE_API NULL

# Copy nodejs files
RUN mkdir /web
ADD web/ /web/

WORKDIR /web
RUN npm install
CMD ["node", "app.js"]