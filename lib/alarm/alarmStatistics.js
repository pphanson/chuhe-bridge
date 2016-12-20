/**
 * Created by a on 2016/12/20.
 */
import mongodb from "mongodb";
async function getConnection() {
    return mongodb.MongoClient.connect('mongodb://localhost:27017/zhixingdb_chuhedq');
}
async function getresult(from, to) {
    var connect = await getConnection();
    var collection = connect.collection('alarm');
    let startTime = new Date(from).getTime();
    let endTime = new Date(to).getTime();
    console.log(startTime);
    console.log(endTime);
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
        "simpleSensor": simpleSensor,
        "sensorType": sensorType,
        "sensorPosition": sensorPosition
    };
    return result;
}
export default getresult;
