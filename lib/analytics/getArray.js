/**
 * Created by a on 2016/12/11.
 */
<<<<<<< HEAD

let getKey = function (obj) {
    let keys = [];
=======
import mongodb from "mongodb";
import SensorMetaX from "../sensors/SensorMeta";
import SensorInstanceX from "../sensors/Sensor";
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
>>>>>>> 70373f44b972e8bd4d208d60f5716ac5893ae412
    for (let key in obj) {
        if (key) {
            keys.push(key);
        }
    }
    return keys;
};

exports.asyncGetArray = async function (rawData, interval, key, llup, lldown) {
    let timeData = [];
    let sum = 0;
    let count = 0;
    let up = parseFloat(llup);
    let down = parseFloat(lldown);
    for (let i = 0; i < rawData.length; i++) {
        let timeAndValue = [];
        timeAndValue.push(interval * i);
        let value = rawData[i][key];
        if (value < down || value > up) {
            timeAndValue.push(0);
        } else {
            timeAndValue.push(value);
            sum = sum + value;
            count++;
        }
        timeData.push(timeAndValue);
    }
    let avg = sum / count;
    for (let i = 0;i < timeData.length; i++) {
        if (timeData[i][1] === 0) {
            timeData[i][1] = avg;
        }
    }
    return timeData;
}
<<<<<<< HEAD
exports.getKey = getKey;
=======
>>>>>>> 70373f44b972e8bd4d208d60f5716ac5893ae412
