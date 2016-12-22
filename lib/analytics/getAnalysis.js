/**
 * Created by a on 2016/12/10.
 */
import getArray from "./getArray";
import getSensors from "./../sensors";


async function getAnalysis(sensor1Id, sensor2Id, from, to) {
    // 获取两个传感器对象在传感器对象数组中的位置
    let loc1;
    let loc2;
    let result = [];
    let sensors = await getSensors.getSensors();
    for (let i = 0; i < sensors.length; i++) {
        if (sensors[i].id === sensor1Id) {
            if (sensor1Id === sensor2Id) {
                loc1 = i;
                loc2 = i;
            } else {
                loc1 = i;
            }
        } else if (sensors[i].id === sensor2Id) {
            loc2 = i;
        }
    }
    // 获取传感器间隔时间，数据的Key,异常处理的范围
    let interval1 = sensors[loc1].meta._monitor.interval;
    let interval2 = sensors[loc2].meta._monitor.interval;
    let key1 = getArray.getKey(sensors[loc1].meta.alarm)[0];
    let key2 = getArray.getKey(sensors[loc2].meta.alarm)[0];
    let sensorllup1 = sensors[loc1].meta.alarm[key1].llup;
    let sensorlldown1 = sensors[loc1].meta.alarm[key1].lldown;
    let sensorllup2 = sensors[loc2].meta.alarm[key2].llup;
    let sensorlldown2 = sensors[loc2].meta.alarm[key2].lldown;

    // 获取两个传感器数据
    let [rawData1, rawData2] = await Promise.all([sensors[loc1].storage.query(new Date(from), new Date(to)),
        sensors[loc2].storage.query(new Date(from), new Date(to))]);
    // 处理异常，并给数据加上时间点
    let [array1, array2] = await Promise.all([getArray.asyncGetArray(rawData1, interval1, key1, sensorllup1, sensorlldown1), getArray.asyncGetArray(rawData2, interval2, key2, sensorllup2, sensorlldown2)]);
    var count = 0;
    let SumX = 0;
    let SumY = 0;
    let SumXY = 0;
    let SumXX = 0;
    let SumYY = 0;
    let conX;
    let conY;
    let Lxy = 0;
    let Lxx = 0;
    let Lyy = 0;
    let b;
    let a;
    let R;
    // let R2;
    // let A1;
    // let S1;
    // let S2;
    // let F1;
    let minX = array1[1][1];
    let maxX = array1[1][1];
    let minY = array2[1][1];
    let maxY = array2[1][1];
    let arrx = [];
    let arry = [];
    // 根据时间两个传感器的间隔时间，获取时间相近的两个点，并获取算法所需要的数据。
    if (interval1 <= interval2) {
        let Boundary = interval1 / 2;
        let j = 0;
        for (let i = 0; i < array2.length; i++) {
            for (; j < array1.length; j++) {
                if (Math.abs(array2[i][0] - array1[j][0]) < Boundary) {
                    let array = [];
                    array.push(array1[j][1]);
                    arrx.push(array1[j][1]);
                    array.push(array2[i][1]);
                    arry.push(array2[i][1]);
                    result.push(array);
                    count++;
                    SumX = SumX + array1[j][1];
                    SumY = SumY + array2[i][1];
                    SumXY = SumXY + array2[i][1] * array1[j][1];
                    SumXX = SumXX + array1[i][1] * array1[i][1];
                    SumYY = SumYY + array2[i][1] * array2[i][1];
                    if (array1[j][1] < minX) {
                        minX = array1[j][1];
                    } else if (array1[j][1] > maxX) {
                        maxX = array1[j][1];
                    }
                    if (array2[i][1] < minY) {
                        minY = array2[i][1];
                    } else if (array1[i][1] > maxY) {
                        maxY = array2[i][1];
                    }
                    break;
                }
            }
        }
    } else {
        let Boundary = interval2 / 2;
        let j = 0;
        for (let i = 0; i < array1.length; i++) {
            for (; j < array2.length; j++) {
                if (Math.abs(array1[i][0] - array2[j][0]) < Boundary) {
                    let array = [];
                    array.push(array1[i][1]);
                    array.push(array2[j][1]);
                    result.push(array);
                    count++;
                    SumX = SumX + array1[i][1];
                    SumY = SumY + array2[j][1];
                    SumXY = SumXY + array1[i][1] * array2[j][1];
                    SumXX = SumXX + array1[i][1] * array1[i][1];
                    SumYY = SumYY + array2[j][1] * array2[j][1];
                    if (array1[i][1] < minX) {
                        minX = array1[i][1];
                    } else if (array1[i][1] > maxX) {
                        maxX = array1[i][1];
                    }
                    if (array2[j][1] < minY) {
                        minY = array2[j][1];
                    } else if (array2[j][1] > maxY) {
                        maxY = array2[j][1];
                    }
                    break;
                }
            }
        }
    }
    conX = 1 / count * SumX;            // X轴平均值
    conY = 1 / count * SumY;            // Y轴平均值
    Lxy = SumXY - 1 / count * (SumX * SumY);
    Lxx = SumXX - 1 / count * (SumX * SumX);
    Lyy = SumYY - 1 / count * (SumY * SumY);

    b = Lxy / Lxx;                      // 直线的斜率
    a = conY - b * conX;                // 直线的截距

    R = parseFloat((Lxy / (Math.sqrt(Lxx) * Math.sqrt(Lyy))).toFixed(1)); // 相关系数  保留
    if (isNaN(R)) {
        R = 0;
    }
    // R2 = R * R;                                 //判定系数
    // A1 = (count * SumXY - SumX * SumY) / (count * SumXX - SumX * SumX);
    // S1 = A1 * A1 * Lxx;
    // S2 = Lyy - A1 * A1 * Lxx;
    // F1 = S1 / (S2 / (count - 2));                   // 方差分析
    let startPointY = minX * b + a;
    let endPointY = maxX * b + a;
    return { "Correlation": R, "min_X": minX, "max_X": maxX, "startPointY": startPointY, "endPointY": endPointY, "result": result};
}

export default getAnalysis;


