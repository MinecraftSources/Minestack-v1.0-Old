package com.rmb938.mn2.docker.etcd;

public class EtcdResult {
    // General values
    public String action;
    public EtcdNode node;
    public EtcdNode prevNode;

    // For errors
    public Integer errorCode;
    public String message;
    public String cause;
    public int errorIndex;

    public boolean isError() {
        return errorCode != null;
    }

    @Override
    public String toString() {
        return EtcdClient.format(this);
    }
}
