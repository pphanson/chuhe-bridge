/**
 * Created by a on 2016/12/18.
 */
import getSensors from "../../sensors";

async function eventDetail(from, to, sensorId) {
    let sensors = getSensors.getSensors();              // 获取传感器实例对象
    let startTime = new Date(from).getTime();
    let endTime = new Date(to).getTime();
    let beforeTime = 2 * startTime - endTime;
    let lastTime = 2 * endTime - startTime;
    let sensor;
    for (let i = 0; i < sensors.length; i++) {
        if (sensors[i].id === sensorId) {
            sensor = sensors[i];
            break;
        }
    }
    let interval = sensor.meta._monitor.interval;
    let key = Object.keys(sensor.meta.alarm)[0];
    let docs = await sensor.storage.query(new Date(beforeTime), new Date(lastTime));
    let result = await Pretreatment(docs, key, interval, _getHours(new Date(beforeTime)), startTime);
    return result;
}
// 数据预处理，再加上时间戳
async function Pretreatment(rawData, key, interval, date, startTime) {
    let time = new Date(date).getTime();
    let result = [];
    for (let i = 0; i < rawData.length; i++) {
        let timeTemp = time + i * interval;
        let array = [];
        array.push(timeTemp);
        if (Math.abs(rawData[i][key]) > 1000000) {
            array.push(null);
        } else {
            array.push(rawData[i][key]);
        }
        result.push(array);
    }
    return result;
}

function _getHours(time) {
    if (time) {
        return new Date(
            time.getFullYear(),
            time.getMonth(),
            time.getDate(),
            time.getHours());
    } else {
        return null;
    }
}

export default eventDetail;

