import storage from "../storage/index";

async function getAlarmList(from, to, page, level, alarmType, keyword)
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
        if (keyword !== undefined) {
            if ((level * 1) !== 0 && alarmType !== "全部") {
                [docs, count] = await Promise.all([
                    collection.find({"alarm_type": alarmType, "alarm_lever": parseFloat(level),
                        timestamp: {$gte: from * 1, $lte: to * 1},
                        $or: [{"sensor_name": {$regex: keyword}}, {"alarm_content": {$regex: keyword}}]
                    }).skip(10 * page).limit(33).toArray(),
                    collection.find({"alarm_type": alarmType, "alarm_lever": parseFloat(level),
                        timestamp: {$gte: from * 1, $lte: to * 1},
                        $or: [{"sensor_name": {$regex: keyword}}, {"alarm_content": {$regex: keyword}}]
                    }).count()
                ]);

            } else if ((level * 1) !== 0 && alarmType === "全部") {
                [docs, count] = await Promise.all([
                    collection.find({"alarm_lever": parseFloat(level),
                        timestamp: {$gte: from * 1, $lte: to * 1},
                        $or: [{"sensor_name": {$regex: keyword}}, {"alarm_content": {$regex: keyword}}]
                    }).skip(10 * page).limit(33).toArray(),
                    collection.find({"alarm_lever": parseFloat(level),
                        timestamp: {$gte: from * 1, $lte: to * 1},
                        $or: [{"sensor_name": {$regex: keyword}}, {"alarm_content": {$regex: keyword}}]
                    }).count()
                ]);
            } else if (alarmType !== "全部" && (level * 1) === 0) {
                [docs, count] = await Promise.all([
                    collection.find({"alarm_type": alarmType,
                        timestamp: {$gte: from * 1, $lte: to * 1},
                        $or: [{"sensor_name": {$regex: keyword}}, {"alarm_content": {$regex: keyword}}]
                    }).skip(10 * page).limit(33).toArray(),
                    collection.find({"alarm_type": alarmType,
                        timestamp: {$gte: from * 1, $lte: to * 1},
                        $or: [{"sensor_name": {$regex: keyword}}, {"alarm_content": {$regex: keyword}}]
                    }).count()
                ]);
            } else {
                [docs, count] = await Promise.all([
                    collection.find({timestamp: {$gte: from * 1, $lte: to * 1},
                        $or: [{"sensor_name": {$regex: keyword}}, {"alarm_content": {$regex: keyword}}]
                    }).skip(10 * page).limit(33).toArray(),
                    collection.find({timestamp: {$gte: from * 1, $lte: to * 1},
                        $or: [{"sensor_name": {$regex: keyword}}, {"alarm_content": {$regex: keyword}}]
                    }).count()
                ]);
            }
        } else {
            if ((level * 1) !== 0 && alarmType !== "全部") {
                [docs, count] = await Promise.all([
                    collection.find({"alarm_type": alarmType, "alarm_lever": parseFloat(level),
                        timestamp: {$gte: from * 1, $lte: to * 1}
                    }).skip(10 * page).limit(33).toArray(),
                    collection.find({"alarm_type": alarmType, "alarm_lever": parseFloat(level),
                        timestamp: {$gte: from * 1, $lte: to * 1}
                    }).count()
                ]);

            } else if ((level * 1) !== 0 && alarmType === "全部") {
                [docs, count] = await Promise.all([
                    collection.find({"alarm_lever": parseFloat(level),
                        timestamp: {$gte: from * 1, $lte: to * 1}}).skip(10 * page).limit(33).toArray(),
                    collection.find({"alarm_lever": parseFloat(level),
                        timestamp: {$gte: from * 1, $lte: to * 1}}).count()
                ]);
            } else if (alarmType !== "全部" && (level * 1) === 0) {
                [docs, count] = await Promise.all([
                    collection.find({"alarm_type": alarmType,
                        timestamp: {$gte: from * 1, $lte: to * 1}
                    }).skip(10 * page).limit(33).toArray(),
                    collection.find({"alarm_type": alarmType,
                        timestamp: {$gte: from * 1, $lte: to * 1}
                    }).count()
                ]);
            } else {
                [docs, count] = await Promise.all([
                    collection.find({timestamp: {$gte: from * 1, $lte: to * 1}}).skip(10 * page).limit(33).toArray(),
                    collection.find({timestamp: {$gte: from * 1, $lte: to * 1}}).count()
                ]);
            }
        }
    } catch (err) {
        throw err;
    }
    sumpage = Math.ceil(count / 10);
    let result = {
        "docs": docs,
        "sumpage": sumpage
    }
    return result;
}

export default getAlarmList;