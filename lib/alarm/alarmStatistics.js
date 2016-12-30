/**
 * Created by a on 2016/12/20.
 */
import storage from "../storage/index";
async function getresult(from, to) {
    let connect = storage.connection.internalConnection;
    let collection = connect.collection('alarm');
    let startTime = new Date(from).getTime();
    let endTime = new Date(to).getTime();
    let simpleSensor = await collection.group(      // 单传感器查询
        ["sensor_name"],
        {"timestamp": {$gt: parseFloat(startTime), $lt: parseFloat(endTime)}},
        {"count": 0},
        "function(obj,prev){prev.count++;}"
    );
    let sensorType = await collection.group(        // 按照传感器类型查询
        ["sensor_type_name"],
        {"timestamp": {$gt: startTime, $lt: endTime}},
        {"count": 0},
        "function(obj,prev){prev.count++;}"
    );
    let sensorPosition = await collection.group(    // 按照传感器位置查询
        ["alarm_position"],
        {"timestamp": {$gt: startTime, $lt: endTime}},
        {"count": 0},
        "function(obj,prev){prev.count++;}"
    );
    let result = {
        "simpleSensor": simpleSensor.sort(sortNumber).slice(0, 6),
        "sensorType": sensorType.sort(sortNumber).slice(0, 6),
        "sensorPosition": sensorPosition.sort(sortNumber).slice(0,6)
    };
    return result;
}
function sortNumber(a, b) {
    return b.count - a.count;
}
export default getresult;
