/**
 * Created by a on 2016/12/11.
 */

let getKey = function (obj) {
    let keys = [];
    for (let key in obj) {
        if (key) {
            keys.push(key);
        }
    }
    return keys;
};
// 数据预处理
exports.asyncGetArray = async function (rawData, interval, key, llup, lldown) {
    let timeData = [];
    let sum = 0;
    let count = 0;
    let up = parseFloat(llup);
    let down = parseFloat(lldown);
    for (let i = 0; i < rawData.length; i++) {                  // 剔除异常的点
        let timeAndValue = [];
        timeAndValue.push(interval * i);
        let value = rawData[i][key];
        if (value < down || value > up) {
            timeAndValue.push(0);
        } else {
            timeAndValue.push(value);
            sum = sum + value;
            count++;
        }
        timeData.push(timeAndValue);
    }
    let avg = sum / count;
    for (let i = 0;i < timeData.length; i++) {
        if (timeData[i][1] === 0) {
            timeData[i][1] = avg;
        }
    }
    let pointCount = Math.floor(timeData.length / 600);             // 设置只发送到前台的点的个数，除号后面为个数
    let resultData = [];
    let sumTime = 0;
    let sumValues = 0;
    for (let i = 0; i < timeData.length; i++) {
        if ((i % pointCount === 0) && i !== 0) {
            let tempArray = [];
            tempArray.push(sumTime / pointCount);
            tempArray.push(sumValues / pointCount);
            resultData.push(tempArray);
            sumTime = 0;
            sumValues = 0;
        } else {
            sumTime = sumTime + timeData[i][0];
            sumValues = sumValues + timeData[i][1];
        }
    }
    console.log(resultData.length);
    return resultData;
}
exports.getKey = getKey;

