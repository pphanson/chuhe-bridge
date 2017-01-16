/**
 * Created by xiong on 2017/1/13.
 */
import storage from "../storage/index";
async function trafficFlow() {
    let startTime = _getHours(new Date(), 1);
    let connect = storage.connection.internalConnection;
    let collectionInsert = connect.collection("traffic_flow");
    let docs = await collectionInsert.find({"timestamp": {$gt: startTime * 1}}).sort({"timestamp": 1}).toArray();
    let result = [];
    let dayTime = 1000 * 60 * 60 * 24;
    let days = (_getHours(new Date(), 0) * 1 - _getHours(new Date(), 1) * 1) / dayTime;
    let j = 0;
    for (let i = 0; i < days; i++) {
        let temptime = _getHours(new Date(), 1) * 1 + dayTime * (i + 1);
        console.log(temptime);
        for (j; j < docs.length; j++) {
            if (docs[j].timestamp === temptime) {
                result[i] = {
                    time: temptime,
                    value: docs[j]
                }
                j++;
                break;
            } else {
                result[i] = {
                    time: temptime,
                    value: 0
                }
                break;
            }
        }
    }
    return result;
}

function _getHours(time, month, day) {
    if (time) {
        if (arguments.length === 2) {
            return new Date(
                time.getFullYear(),
                time.getMonth() - month,
                time.getDate());
        } else {
            return new Date(
                time.getFullYear(),
                time.getMonth() - month,
                time.getDate() + day);
        }
    } else {
        return null;
    }
}

export default trafficFlow;

