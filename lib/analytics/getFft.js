/**
 * Created by a on 2016/12/11.
 */
import mongodb from "mongodb";
import getArray from "./getArray";
import fft from "fft-js";

// import express from "express";

async function getConnection() {
    return await mongodb.MongoClient.connect('mongodb://localhost:27017/zhixingdb_chuhedq');
}
let getResultArray = async function (sensorId) {
    let result = [];
    let n = 0;
    let sum = 0;
    let s = await getArray.asyncGetSensorMetaAndInstance(sensorId);
    let connect = await getConnection();
    let collection = connect.collection(s.collectionName);
    let rawData = await collection.find({}).toArray();
    for (let i = 0; i < rawData.length; i++) {
        for (let j = 0;j < rawData[i].values.length; j++) {
            result.push(rawData[i].values[j][s.key]);
            sum++;
        }
    }
    while (Math.pow(2, n) < sum) {
        n++;
    }
    while (sum - Math.pow(2, n)) {
        result.push(0);
        sum++;
    }
    return result;
}

let aaaa = async function (sensorId) {
    let array = await getResultArray(sensorId);
    let sensorfft = fft.fft(array);
    console.log(sensorfft);
}

aaaa('0501');
