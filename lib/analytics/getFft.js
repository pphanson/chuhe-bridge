/**
 * Created by a on 2016/12/11.
 */
import fft from "fft-js";
import getSensors from "./../sensors";
import getArray from "./getArray";

let getResultArray = async function (sensorId, from, to) {
    // 获取传感器对象
    let result = [];
    let n = 0;
    let sensors = await getSensors.getSensors();
    let sensor;
    for (let i = 0; i < sensors.length; i++) {
        if (sensors[i].id === sensorId) {
            sensor = sensors[i];
            break;
        }
    }
    // 获取频率，键，数据，把数据放入数组
    let interval = sensor.meta._monitor.interval;
    let frequency = 1000 / interval;
    let key = getArray.getKey(sensor.meta.alarm)[0];
    let sensorllup = sensor.meta.alarm[key].llup;
    let sensorlldown = sensor.meta.alarm[key].lldown;
    let rawData = await sensor.storage.query(new Date(from), new Date(to));
    // 比较2的N次方，得到要进行fft的数组。
    while (Math.pow(2, n) < rawData.length) {
        n++;
    }
    if ((Math.pow(2, n) - rawData.length) > (rawData.length - Math.pow(2, n - 1))) {
        n = n - 1;
        let sum = Math.pow(2, n);
        for (let i = 0; i < sum; i++) {
            result.push(rawData[i][key]);
        }
    } else {
        let sum = Math.pow(2, n);
        let length = rawData.length;
        for (let i = 0; i < sum; i++) {
            if (i < length) {
                result.push(rawData[i][key]);
            } else {
                result.push(0);
            }
        }
    }
    // 给原始数据加时间戳，异常处理，装入数组待发送前台。
    let timeArray = await getArray.asyncGetArray(rawData, interval, key, sensorllup, sensorlldown, "true");

    return {"result": result, "n": Math.pow(2, n), "timeArray": timeArray, "frequency": frequency};
}

async function fftAnalysis(sensorId, from, to) {
    // fft操作
    let array = await getResultArray(sensorId, from, to);
    let sensorfft = await fft.fft(array.result);
    let fftSquart = [];
    const piecetime = array.frequency / array.n;
    let n = array.n / 2;
    for (let i = 1; i < sensorfft.length; i++) {
        let timeArray = [];
        sensorfft[i][0] = sensorfft[i][0] / n;
        sensorfft[i][1] = sensorfft[i][1] / n;
        let sa = sensorfft[i][0] * sensorfft[i][0] + sensorfft[i][1] * sensorfft[i][1];
        timeArray.push(piecetime * i);
        timeArray.push(Math.sqrt(sa));
        fftSquart.push(timeArray);
    }
    let result = {
        "sensorFft": fftSquart,
        "timeArray": array.timeArray
    };
    return result;
}

export default fftAnalysis;


