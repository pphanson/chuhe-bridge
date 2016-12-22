/**
 * Created by a on 2016/12/13.
 */
import mongodb from "mongodb";

async function getConnection() {
    return mongodb.MongoClient.connect('mongodb://localhost:27017/zhixingdb_chuhedq');
}

// 根据传入参数的个数动态确定要返回的特殊事件列表
async function allEvents(from, to, page, keyWords) {             // page总数待优化
    let connect = await getConnection();
    let collection1 = connect.collection('spaseventtype');
    let collection2 = connect.collection("spasevent");
    let eventTypeInfo;
    let allEvent;
    let count;

    if (keyWords !== undefined) {                                // 参数为4的时候，先获取到特殊事件名字中含有查询条件keywords的事件Id，得到一个数组,然后再放入下一个查询条件
        let eventTypes = [];
        eventTypeInfo = await collection1.find({"eventTypeName": {$regex: keyWords}}).toArray();
        for (let i = 0; i < eventTypeInfo.length; i++) {
            eventTypes.push(eventTypeInfo[i].eventTypeId);
        }
        count = await collection2.find({
            $and: [
                {"startTime": {"$gt": parseFloat(from), "$lt": parseFloat(to)}},
                {$or: [
                        {"eventName": /keyWords/},
                        {"eventTypeId": {$in: eventTypes}}
                ]
                }
            ]
        }).count();
        if (count < page * 5) {
            page--;
        }
        allEvent = await collection2.find({
            $and: [
                {"startTime": {"$gt": parseFloat(from), "$lt": parseFloat(to)}},
                {$or: [
                    {"eventName": /keyWords/},
                    {"eventTypeId": {$in: eventTypes}}
                ]}
            ]
        }).skip(page * 5).limit(15).toArray();
    } else {
        count = await collection2.find({
            "startTime": {
                "$gt": parseFloat(from),
                "$lt": parseFloat(to)
            }}).count();
        if (count < page * 5) {
            page--;
        }
        let eventNamesPromise = collection1.find({}).sort({"eventTypeId": 1}).toArray();
        let allEventPromise = collection2.find({
            "startTime": {
                "$gt": parseFloat(from),
                "$lt": parseFloat(to)
            }
        }).skip(page * 5).limit(15).toArray();
        eventTypeInfo = await eventNamesPromise;
        allEvent = await allEventPromise;
    }
    for (let i = 0; i < allEvent.lengt; i++) {         // 给查询的特殊事件添加事件类型名称
        for (let j = 0; j < eventTypeInfo.length; j++) {
            if (allEvent[i].eventTypeId === eventTypeInfo[j].eventTypeId) {
                allEvent[i].eventTypeName = eventTypeInfo[j].eventTypeName;
                break;
            }
        }
    }
    return allEvent;
}

export default allEvents;
