import storage from "../storage/index";

async function getAlarmList(from, to)
{
    let connect = storage.connection.internalConnection;
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
