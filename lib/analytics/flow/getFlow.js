/**
 * Created by xiong on 2017/1/13.
 */
import storage from "../../storage/index";
async function trafficFlow() {
    let startTime = _getHours(new Date(), 1);
    let connect = storage.connection.internalConnection;
    let collectionInsert = connect.collection("traffic_flow");
    let docs = await collectionInsert.find({"timestamp": {$gt: startTime * 1}}).sort({"timestamp": 1}).toArray();
    let everyDayNumber = [];
    let everyHourCar = [];
    let everyHourWeight = [];
    let validHourDays = [];
    let validDays = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    let weigthLevel = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 24; i++) {                                                              // 初始化每个小时的数量和重量的数组以及有效小时的天数
        everyHourCar[i] = 0;
        everyHourWeight[i] = 0;
        validHourDays[i] = 0;
    }
    let dayTime = 1000 * 60 * 60 * 24;
    let days = (_getHours(new Date(), 0) * 1 - _getHours(new Date(), 1) * 1) / dayTime;         // 获取天数
    let j = 0;
    for (let i = 0; i < days; i++) {
        let tempTime = _getHours(new Date(), 1) * 1 + dayTime * (i + 1);
        for (j; j < docs.length; j++) {
            if (docs[j].timestamp === tempTime) {                                               // 每天的车辆总数
                everyDayNumber[i] = {
                    time: tempTime,
                    total: docs[j].total
                };
                for (let k = 0; k < docs[j].sumWeightArray.length; k++) {                        //  有车辆必有重量，合在一个遍历里面，遍历重量和数量
                    everyHourWeight[k] += docs[j].sumWeightArray[k];
                    everyHourCar[k] += docs[j].cars[k];
                    if (docs[j].sumWeightArray[k] !== 0) {
                        validHourDays[k] += 1;
                    }
                }
                for (let s = 0; s < docs[j].weight.length; s++) {
                    weigthLevel[s] += docs[j].weight[s];
                    if (docs[j].weight[s] !== 0) {
                        validDays[s] += 1;
                    }
                }
                j++;
                break;
            } else {
                everyDayNumber[i] = {
                    time: tempTime,
                    total: 0
                };
                break;
            }
        }
    }
    for (let i = 0; i < 24; i++) {                                                              // 计算每小时的平均数量和重量
        everyHourCar[i] = everyHourCar[i] / validHourDays[i];
        everyHourWeight[i] = everyHourWeight[i] / validHourDays[i];
    }
    for (let j = 0; j < weigthLevel.length; j++) {                                              // 计算重量等级平均值
        weigthLevel[j] = weigthLevel[j] / validDays[j];
    }
    let result = {
        everyDayNumber: everyDayNumber,
        everyHourCar: everyHourCar,
        everyHourWeight: everyHourWeight,
        weigthLevel: weigthLevel
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

