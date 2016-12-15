/**
 * Created by a on 2016/12/13.
 */
import mongodb from "mongodb";
import getEventName from "./getEventName";

async function getConnection() {
    return mongodb.MongoClient.connect('mongodb://localhost:27017/zhixingdb_chuhedq');
}
async function getAllEvent(from, to, page) {
    let connect = await getConnection();
    let collection1 = connect.collection('spaseventtype');
    let collection2 = connect.collection("spasevent");
    let eventNamesPromise = collection1.find({}).sort({"eventTypeId": 1}).toArray();
    let allEventPromise = collection2.find({"eventBeforetime": {"$gt": parseFloat(from), "$lt": parseFloat(to)}}).skip(page * 5).limit(15).toArray();
    let eventNames = await eventNamesPromise;
    let allEvent = await allEventPromise;
    // console.log(allEvent);
    for (let i = 0; i < allEvent.length; i++) {
        for (let j = 0; j < eventNames.length; j++) {
            if (allEvent[i].eventTypeID === eventNames[j].eventTypeId) {
                allEvent[i].eventTypeName = eventNames[j].eventTypeName;
                break;
            }
        }
    }
    // console.log(allEvent);
    return allEvent;
}
exports.getAllEvent = getAllEvent;
// getAllEvent("1478229132000", "1478229134000", "0");
