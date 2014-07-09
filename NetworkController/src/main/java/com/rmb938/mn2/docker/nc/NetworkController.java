package com.rmb938.mn2.docker.nc;

public class NetworkController {

    public static void main(String[] args) {
        new NetworkController();
    }



    public NetworkController() {
        System.getenv("MONGO_URL");
        System.getenv("RABBITMQ_URL");
        System.getenv("REDIS_IP");
        System.getenv("REDIS_PORT");
        System.getenv("ETCD_IP");
        System.getenv("ETCD_PORT");
    }

}
