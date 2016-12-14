/**
 * Created by a on 2016/12/11.
 */
import mongodb from "mongodb";
import SensorMetaX from "../sensors/SensorMetaX";
import SensorInstanceX from "../sensors/SensorInstanceX";
async function getConnection() {
    return await mongodb.MongoClient.connect('mongodb://localhost:27017/zhixingdb_chuhedq');
}
let asyncGetSensorInstance = async function (sensorid) {
    let connect = await getConnection();
    let collection = connect.collection('sensor-instances');
    let temp = await collection.findOne({'id': sensorid});
    let sensor = new SensorInstanceX(temp);
    return sensor;
};
let getKey = async function (obj) {
    for (let key in obj) {
        if (key) {
            return key;
        }
    }
};
exports.asyncGetSensorMetaAndInstance = async function (sensorid) {
    let connect = await getConnection();
    let sensorInstanceX = await asyncGetSensorInstance(sensorid);
    let collection = connect.collection('sensor-meta');
    let sensorData = await collection.findOne({"_id": sensorInstanceX._sensorMetaId});
    let sensorMetas = new SensorMetaX(sensorData);
    let key = await getKey(sensorMetas.values);
    return {"interval": sensorMetas.sensorInterval, "collectionName": sensorInstanceX.collectionName, "key": key};
};


exports.asyncGetArray = async function (rawData, interval, key) {
    let timeData = [];
    for (let i = 0; i < rawData.length; i++) {
        for (let j = 0; j < rawData[i].values.length; j++) {
            let TimeAndValue = [];
            let timestamp = (rawData[i].timestamp) + (interval * j);
            TimeAndValue.push(timestamp);
            TimeAndValue.push(rawData[i].values[j][key]);
            timeData.push(TimeAndValue);
        }
    }
    return timeData;
}

