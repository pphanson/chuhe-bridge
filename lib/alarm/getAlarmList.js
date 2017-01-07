import storage from "../storage/index";

async function getAlarmList(from, to, page, level, alarmType)
{
    let connect = storage.connection.internalConnection;
    let collection = connect.collection('alarm');
    if (from * 1 > to * 1) {
        throw new Error("'To' time must be greater than 'from' time.");
    }
    let docs = null;
    let count = null;
    let sumpage;
    try {
        if ((level * 1) !== 0 && alarmType !== "全部") {
            [docs,count] = await Promise.all([
                collection.find({"alarm_type": alarmType,"alarm_lever":parseFloat(level),timestamp: {$gte: from * 1, $lte: to * 1}}).skip(10 * page).limit(33).toArray(),
                collection.find({"alarm_type": alarmType,"alarm_lever":parseFloat(level),timestamp: {$gte: from * 1, $lte: to * 1}}).count()
            ]);

        } else if ((level * 1) !== 0 && alarmType  === "全部") {
            [docs,count] = await Promise.all([
                collection.find({"alarm_lever":parseFloat(level),timestamp: {$gte: from * 1, $lte: to * 1}}).skip(10 * page).limit(33).toArray(),
                collection.find({"alarm_lever":parseFloat(level),timestamp: {$gte: from * 1, $lte: to * 1}}).count()
            ]);
        } else if (alarmType !== "全部"  && (level * 1) === 0) {
            [docs,count] = await Promise.all([
                collection.find({"alarm_type": alarmType, timestamp: {$gte: from * 1, $lte: to * 1}}).skip(10 * page).limit(33).toArray(),
                collection.find({"alarm_type": alarmType, timestamp: {$gte: from * 1, $lte: to * 1}}).count()
            ]);
        } else {
            [docs,count] = await Promise.all([
                collection.find({timestamp: {$gte: from * 1, $lte: to * 1}}).skip(10 * page).limit(33).toArray(),
                collection.find({timestamp: {$gte: from * 1, $lte: to * 1}}).count()
            ]);
        }
    } catch (err) {
        throw err;
    }
    sumpage = Math.ceil(count / 8);
    let result = {
        "docs":docs,
        "sumpage":4
    }
    return result;
}

export default getAlarmList;