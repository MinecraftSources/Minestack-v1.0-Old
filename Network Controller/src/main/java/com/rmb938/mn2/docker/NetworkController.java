package com.rmb938.mn2.docker;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class NetworkController {

    private static final Logger logger = LogManager.getLogger(NetworkController.class.getName());

    public static void main(String[] args) {
        new NetworkController();
    }

    public NetworkController() {
        logger.info("Starting Network Controller");
    }

}
