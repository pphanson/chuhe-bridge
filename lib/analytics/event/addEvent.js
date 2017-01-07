/**
 * Created by a on 2016/12/13.
 */
import storage from "../../storage/index";
let ObjectID = require('mongodb').ObjectID;
// 特殊事件构造函数，预留桥的Id
class SpasEvent {
    constructor(req) {
        this.eventTypeId = req.body.eventTypeId;
        if (req.body.bridgeid === undefined) {
            this.bridgeId = "BRG001";
        } else {
            this.bridgeId = req.body.bridgeId;
        }
        this.eventName = req.body.eventName;
        this.startTime = new Date(req.body.startTime).getTime();
        this.endTime = new Date(req.body.endTime).getTime();
    }
}

// 存储进数据库，返回值成功或者失败字符串
async function addEvent(req) {
    let result;
    let temp;
    let conn = storage.connection.internalConnection;
    let spasevent = new SpasEvent(req);
    if (req.body.id !== undefined) {
        temp = await conn.collection("spasevent").updateOne({"_id":ObjectID(req.body.id)},{$set:spasevent});
        result = temp.modifiedCount === 1 ? "success" : "fail";
    } else {
        temp = await conn.collection("spasevent").insertOne(spasevent);
        result = temp.insertedCount === 1 ? "success" : "fail";
    }
    return result;
}
/*// 示例对象
let ccc = {
    "eventName": "2016-12-12日大风事件",
    "eventTypeId": "SPET_002",
    "startTime": "2016-11-02T03:12:13.000Z",
    "endTime": "2016-11-02T03:13:13.000Z",
};
addEvent(ccc);*/

export default addEvent;
