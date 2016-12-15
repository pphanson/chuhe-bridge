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

exports.asyncGetArray = async function (rawData, interval, key, llup, lldown) {
    let timeData = [];
    let sum = 0;
    let count = 0;
    let up = parseFloat(llup);
    let down = parseFloat(lldown);
    for (let i = 0; i < rawData.length; i++) {
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
    return timeData;
}
exports.getKey = getKey;

