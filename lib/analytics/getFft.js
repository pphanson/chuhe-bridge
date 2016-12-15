/**
 * Created by a on 2016/12/11.
 */
import fft from "fft-js";
import getSensors from "./../sensors";
import getArray from "./getArray";

let getResultArray = async function (sensorId, from, to) {
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

    let interval = sensor.meta.monitor.interval;
    console.log(interval);
    let frequency = 1000 / interval;
    console.log(sensor.meta);
    let key = getArray.getKey(sensor.meta.alarm)[0];
    console.log(key);
    let rawData = await sensor.storage.query(new Date(from), new Date(to));

    for (let i = 0; i < rawData.length; i++) {
        result.push(rawData[i][key]);
    }
    while (Math.pow(2, n) < rawData.length) {
        n++;
    }
    console.log(n);
    if ((Math.pow(2, n) - rawData.length) > (rawData.length - Math.pow(2, n - 1))) {
        n = n - 1;
        result = result.slice(0, Math.pow(2, n));
    } else {
        while ((Math.pow(2, n) - rawData.length) > 0) {
            result.push(0);
        }
    }

    let timeArray = [];
    for (let i = 0; i < result.length; i++) {
        let tempArray = [];
        tempArray.push(5 * i);
        tempArray.push(result[i]);
        timeArray.push(tempArray);
    }

    return {"result": result, "n": Math.pow(2, n), "timeArray": timeArray, "frequency": frequency};
}

async function getFft(sensorId, from, to) {

    let array = await getResultArray(sensorId, from, to);
    let sensorfft = await fft.fft(array.result);
    let fftSquart = [];
    const piecetime = array.frequency / array.n;
    let n = array.n / 2;
    for (let i = 0; i < sensorfft.length; i++) {
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
    //console.log(result);
    return result;
}

export default getFft;


