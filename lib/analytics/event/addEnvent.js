/**
 * Created by a on 2016/12/13.
 */
import mongodb from "mongodb";

async function getConnection() {
    return await mongodb.MongoClient.connect('mongodb://localhost:27017/zhixingdb_chuhedq');
}

class SpasEvent {
    constructor(req) {
        this.eventID = req.query.eventID;
        this.bridgeid = req.query.bridgeid;
        this.eventName = req.query.eventName;
        this.eventTypeID = req.query.eventTypeID;
        this.eventBeforeloc = new Date(req.query.eventBeforeloc).getTime();
        this.eventBeforetime = new Date(req.query.eventBeforetime).getTime();
        this.eventAfterTime = new Date(req.query.eventAfterTime).getTime();
        this.eventAfterloc = new Date(req.query.eventAfterloc).getTime();
    }
}


async function addEvent(req) {
    let connect = await getConnection();
    let collection = connect.collection("spasevent");
    let spasevent = new SpasEvent(config);
    collection.insertOne(spasevent);
    connect.close();
    console.log(spasevent);
}
let ccc = {
    "eventID": "SPE_001",
    "bridgeid": "BRG002",
    "eventName": "2016-12-12日南京大屠杀事件",
    "eventTypeID": "SPET_002",
    "eventBeforeloc": "2016-11-03T03:12:13.000Z",
    "eventBeforetime": "2016-11-04T03:12:13.000Z",
    "eventAfterTime": "2016-11-04T03:12:13.000Z",
    "eventAfterloc": "2016-11-04T03:12:13.000Z",
};
// addEvent(ccc);
exports.addEvent = addEvent;
