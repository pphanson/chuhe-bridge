/**
 * Created by xiong on 2017/1/6.
 */
import storage from "../../storage/index";
let ObjectID = require('mongodb').ObjectID;
async function getEvent(eventId) {
    let connect = storage.connection.internalConnection;
    let collection = connect.collection('spasevent');
    let result = await collection.find({"_id": ObjectID(eventId)}).toArray();
    return result;
}

export default getEvent;