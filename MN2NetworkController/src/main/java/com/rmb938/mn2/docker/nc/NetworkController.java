package com.rmb938.mn2.docker.nc;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.ServerAddress;
import com.rabbitmq.client.Address;
import com.rabbitmq.client.Channel;
import com.rmb938.mn2.docker.db.etcd.EtcdClient;
import com.rmb938.mn2.docker.db.etcd.EtcdClientException;
import com.rmb938.mn2.docker.db.mongo.MongoDatabase;
import com.rmb938.mn2.docker.db.rabbitmq.RabbitMQ;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

public class NetworkController {

    private static final Logger logger = LogManager.getLogger(NetworkController.class.getName());


    public static void main(String[] args) {
        new NetworkController();
    }

    private MongoDatabase mongoDatabase;
    private RabbitMQ rabbitMQ;
    private EtcdClient etcdClient;

    public NetworkController() {
        logger.info("Starting MN2 Network Manager");

        if (System.getenv(EnvVariables.NODE_NAME.name()) == null) {
            logger.error("NODE_NAME environment variablesmust be set");
            return;
        }

        if (System.getenv(EnvVariables.MONGO_ADDRESS.name()) != null && System.getenv(EnvVariables.MONGO_DATABASE.name()) != null ) {
            List<ServerAddress> addressList = new ArrayList<>();
            for (String address : System.getenv(EnvVariables.MONGO_ADDRESS.name()).split(",")) {
                String[] info = address.split(":");
                if (info.length == 2) {
                    try {
                        ServerAddress serverAddress = new ServerAddress(info[0], Integer.parseInt(info[1]));
                        addressList.add(serverAddress);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
            if (addressList.isEmpty()) {
                logger.error("Unable to setup connection to mongo cluster");
                return;
            }
            mongoDatabase = new MongoDatabase(addressList, System.getenv(EnvVariables.MONGO_DATABASE.name()));
            logger.info("Connected to Mongo Database");
        } else {
            logger.error("MONGO_ADDRESS and MONGO_DATABASE environment variables must be set");
            return;
        }


        if (System.getenv(EnvVariables.RABBITMQ_ADDRESS.name()) != null && System.getenv(EnvVariables.RABBITMQ_USER.name()) != null &&
                System.getenv(EnvVariables.RABBITMQ_PASS.name()) != null) {
            List<Address> addressList = new ArrayList<>();
            for (String address : System.getenv(EnvVariables.RABBITMQ_ADDRESS.name()).split(",")) {
                String[] info = address.split(":");
                if (info.length == 2) {
                    try {
                        Address serverAddress = new Address(info[0], Integer.parseInt(info[1]));
                        addressList.add(serverAddress);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
            if (addressList.isEmpty()) {
                logger.error("Unable to setup connection to rabbitmq cluster");
                return;
            }
            try {
                rabbitMQ = new RabbitMQ(addressList, System.getenv(EnvVariables.RABBITMQ_USER.name()), System.getenv(EnvVariables.RABBITMQ_PASS.name()));
                logger.info("Connected to RabbitMQ");
            } catch (IOException ex) {
                ex.printStackTrace();
                logger.error("Unable to setup connection to rabbitmq cluster");
                return;
            }
        } else {
            logger.error("RABBITMQ_ADDRESS, RABBITMQ_USER and RABBITMQ_PASS environment variables must be set");
            return;
        }
        try {
            etcdClient = new EtcdClient(new URI("http://172.17.8.101"));//TODO: docker bridge ip
            etcdClient.getVersion();
        } catch (URISyntaxException | EtcdClientException e) {
            e.printStackTrace();
            logger.error("Unable to setup connection to etcd");
            return;
        }

        DBObject object = mongoDatabase.findOne("nodes", new BasicDBObject("local.host", System.getenv(EnvVariables.NODE_NAME.name())));
        if (object == null) {//we don't exist in the database
            logger.info("Controller not in cluster. Waiting for startup commands...");


        }
    }

}
