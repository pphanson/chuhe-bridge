/**
 * Created by a on 2016/12/18.
 */
import getSensors from "../../sensors";

async function eventDetail(from, to, sensorId) {
    let sensors = getSensors.getSensors();              // 获取传感器实例对象
    let startTime = new Date(from).getTime();
    let endTime = new Date(to).getTime();
    let beforeTime = 2 * startTime - endTime;
    let sensor;
    for (let i = 0; i < sensors.length; i++) {
        if (sensors[i].id === sensorId) {
            sensor = sensors[i];
            break;
        }
    }
    let interval = sensor.meta._monitor.interval;
    let key = getKey(sensor.meta.alarm)[0];
    let docs = await sensor.storage.queryTimeStamp(new Date(beforeTime), new Date(to));
    let result = await Pretreatment(docs, key, interval);
    return result;
}
// 数据预处理，减去一个小时时间，然后再加上时间戳
async function Pretreatment(rawData, key, interval) {
    let result = [];
    for (let i = 0; i < rawData.length; i++) {
        let timestamp = rawData[i].timestamp - 1000 * 60 * 60;
        for (let j = 0; j < rawData[i].values.length; j++) {
            let tempArray = [];
            tempArray.push(timestamp + interval * j);
            tempArray.push(rawData[i].values[j][key]);
            result.push(tempArray);
        }
    }
    return result;
}
let getKey = function (obj) {
    let keys = [];
    for (let key in obj) {
        if (key) {
            keys.push(key);
        }
    }
    return keys;
};

export default eventDetail;
