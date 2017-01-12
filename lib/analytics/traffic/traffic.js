/**
 * Created by xiong on 2017/1/12.
 */
import storage from "../../storage/index";
async function trafficHistory() {           // 获取当天的荷载历史
    let data = [];
    let time = _getHours(new Date());
    let count = 0;
    let overWeightCount = 0;
    let connect = storage.connection.internalConnection;
    let collection = connect.collection("sensor-0901");
    let rawData = await collection.find({timestamp: {$gt: time * 1}}).toArray();
    for (let i = 0; i < rawData.length; i++) {
        count += rawData[i].stats.id.total;
        for (let j = 0; j < rawData[i].values.length; j++) {
            if (rawData[i].values[j].overweight > 0) {
                overWeightCount++;
            }
            if (rawData[i].values[j].time > 0 && rawData[i].values[j].time < 2484200800000) {   // 只发送需要的数据给前台
                let obj = rawData[i].values[j];
                let temp = {};
                temp.time = obj.time;
                temp.licenseplate = obj.licenseplate;
                temp.lane = obj.lane;
                temp.acrosstag = obj.acrosstag;
                temp.weight = obj.weight;
                temp.axesnumber = obj.axesnumber;
                temp.overweighttag = obj.overweighttag;
                temp.axesequivalentload1 = obj.axesequivalentload1;
                temp.axesequivalentload2 = obj.axesequivalentload2;
                temp.axesequivalentload3 = obj.axesequivalentload3;
                temp.axesequivalentload4 = obj.axesequivalentload4;
                temp.axesequivalentload5 = obj.axesequivalentload5;
                temp.axesequivalentload6 = obj.axesequivalentload6;
                temp.axesequivalentload7 = obj.axesequivalentload7;
                temp.axesequivalentload8 = obj.axesequivalentload8;
                data.push(temp);
            }
        }
    }
    data = data.slice(data.length - 6, data.length);
    let result = {
        last: data,
        count: count,
        overWeightCount: overWeightCount
    }
    return result;
}
export default trafficHistory;

function _getHours(time) {
    if (time) {
        return new Date(
            time.getFullYear(),
            time.getMonth(),
            time.getDate());
    } else {
        return null;
    }
}
