/**
 * Created by xiong on 2016/12/30.
 */
import getSensors from "./../../sensors";
async function history(from, to, sensorId) {
    let result = [];
    let sensor;
    let sensors = await getSensors.getSensors();
    for (let i = 0;i < sensors.length; i++) {
        if (sensors[i].id === sensorId) {
            sensor = sensors[i];
            break;
        }
    }
    let key = Object.keys(sensor.meta.alarm)[0];
    let interval = sensor.meta._monitor.interval;
    let data = await sensor.storage.query(new Date(from), new Date(to));
    for (let i = 0; i < data.length; i++) {
        let array = [];
        array.push(i * interval);
        array.push(data[i][key]);
        result.push(array);
    }
    return result;
}
export default history;