import storage from "../storage/index";

async function getAlarmList(from, to, page, level)
{
    let connect = storage.connection.internalConnection;
    let collection = connect.collection('alarm');
    if (from * 1 > to * 1) {
        throw new Error("'To' time must be greater than 'from' time.");
    }
    let docs = null;
    try {
        if (level !== undefined) {
            console.log(level);
            docs = await collection.find({"alarm_lever":parseFloat(level),timestamp: {$gte: from * 1, $lte: to * 1}}).skip(8 * page).limit(8).toArray();
        } else {
            docs = await collection.find({timestamp: {$gte: from * 1, $lte: to * 1}}).skip(8 * page).limit(8).toArray();
        }
    } catch (err) {
        throw err;
    }
    return docs;
}

export default getAlarmList;
