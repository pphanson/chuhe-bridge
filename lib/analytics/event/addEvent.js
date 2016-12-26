/**
 * Created by a on 2016/12/13.
 */
import mongodb from "mongodb";
async function getConnection() {
    return await mongodb.MongoClient.connect('mongodb://localhost:27017/zhixingdb_chuhedq');
}
// 特殊事件构造函数，预留桥的Id
class SpasEvent {
    constructor(req) {
        this.eventTypeId = req.query.eventTypeId;
        if (req.query.bridgeid === undefined) {
            this.bridgeId = "BRG001";
        } else {
            this.bridgeId = req.query.bridgeId;
        }
        this.eventName = req.query.eventName;
        this.startTime = new Date(req.query.startTime).getTime();
        this.endTime = new Date(req.query.endTime).getTime();
    }
}

// 存储进数据库，返回值成功或者失败字符串
async function addEvent(req) {
    let connect = await getConnection();
    let collection = connect.collection("spasevent");
    let spasevent = new SpasEvent(req);
    let temp = await collection.insertOne(spasevent);
    let result = temp.insertedCount === 1 ? "success" : "fail";
    return result;
}
/*
// 示例对象
let ccc = {
    "eventName": "2016-12-12日大风事件",
    "eventTypeId": "SPET_002",
    "startTime": "2016-11-02T03:12:13.000Z",
    "endTime": "2016-11-02T03:13:13.000Z",
};
adEvent(ccc);
*/

export default addEvent;
