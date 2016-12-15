/**
 * Created by a on 2016/12/13.
 */
import mongodb from "mongodb";

async function getConnection() {
    return await mongodb.MongoClient.connect('mongodb://localhost:27017/zhixingdb_chuhedq');
}

let getEventName = async function() {
    let connect = await getConnection();
    let collection = connect.collection('spaseventtype');
    let docs = await collection.find({}).sort({"eventTypeId": 1}).toArray();
    console.log(docs);
    return docs;
 /*   let eventName = [];
     for (let i = 0; i < docs.length; i++) {
        let selectedProperties = ["eventTypeId", "eventTypeName"];
        let s = JSON.stringify(docs[i], selectedProperties);
        eventName.push(s);
    }
    */
}
getEventName();
exports.getEventName = getEventName;
