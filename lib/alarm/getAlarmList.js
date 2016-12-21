import mongodb from "mongodb";

async function getConnection() {
    return await mongodb.MongoClient.connect('mongodb://localhost:27017/zhixingdb_chuhedq');
}

async function getAlarmList(from, to)
{
    let connect = await getConnection();
    let collection = connect.collection('alarm');
    if (from * 1 > to * 1) {
        throw new Error("'To' time must be greater than 'from' time.");
    }
    let docs = null;
    try {
        docs = await collection.find({
            timestamp: {
                $gte: from * 1,
                $lte: to * 1
            }
        }).toArray();
    } catch (err) {
        throw err;
    }

    return docs;
}

export default getAlarmList;
