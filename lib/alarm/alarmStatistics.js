/**
 * Created by a on 2016/12/20.
 */
import storage from "../storage/index";
async function getresult(from, to) {
    let connect = storage.connection.internalConnection;
    let collection = connect.collection('alarm');
    let startTime = new Date(from).getTime();
    let endTime = new Date(to).getTime();
    let simpleSensor = await collection.aggregate([         // 单传感器查询
        {$project:{"sensor_name":1,"timestamp":1}},
        {$match:{"timestamp": {$gt: parseFloat(startTime), $lt: parseFloat(endTime)}}},
        {$group:{_id:"$sensor_name","count":{$sum:1}}},
        {$sort:{"count": -1}},
        {$limit:5}
        ]).toArray();
    let sensorType = await collection.aggregate([           // 按照传感器类型查询
        {$project:{"sensor_type_name":1,"timestamp":1}},
        {$match:{"timestamp": {$gt: parseFloat(startTime), $lt: parseFloat(endTime)}}},
        {$group:{_id:"$sensor_type_name","count":{$sum:1}}},
        {$sort:{"count": -1}},
        {$limit:5}
    ]).toArray();
    let sensorPosition = await collection.aggregate([       // 按照传感器位置查询
        {$project:{"alarm_position":1,"timestamp":1}},
        {$match:{"timestamp": {$gt: parseFloat(startTime), $lt: parseFloat(endTime)}}},
        {$group:{_id:"alarm_position","count":{$sum:1}}},
        {$sort:{"count": -1}},
        {$limit:5}
    ]).toArray();
    let result = {
        "simpleSensor": simpleSensor,
        "sensorType": sensorType,
        "sensorPosition": sensorPosition
    };
    return result;
}

export default getresult;
