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
            if(Math.abs(rawData[i].values[j].year) > 10000) {
                continue;
            }
            if (rawData[i].values[j].year > 0) {   // 只发送需要的数据给前台
                let obj = rawData[i].values[j];
                let temp = {};
                temp.time = new Date(parseInt(obj.year), parseInt(obj.month-1), parseInt(obj.day), parseInt(obj.hour),
                   parseInt(obj.minute), parseInt(obj.second)).getTime();
                temp.licenseplate = obj.licenseplate;
                temp.lane = obj.lane;
                temp.acrosstag = obj.acrosstag;
                temp.weight = obj.weight;
                temp.axesnumber = obj.axesnumber;
                temp.overweighttag = obj.overweight;
                temp.axesequivalentload1 = obj.axesweight1;
                temp.axesequivalentload2 = obj.axesweight2;
                temp.axesequivalentload3 = obj.axesweight3;
                temp.axesequivalentload4 = obj.axesweight4;
                temp.axesequivalentload5 = obj.axesweight5;
                temp.axesequivalentload6 = obj.axesweight6;
                temp.axesequivalentload7 = obj.axesweight7;
                temp.axesequivalentload8 = obj.axesweight8;
                data.push(temp);
            }
        }
    }
    data = data.slice(data.length - 7, data.length);
    let result = {
        last: data,
        count: count,
        overWeightCount: overWeightCount,
    };
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
