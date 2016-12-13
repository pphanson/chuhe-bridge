/**
 * Created by a on 2016/12/10.
 */
import mongodb from "mongodb";
import getArray from "./getArray";
import express from "express";
const router = express.Router();

/*
router.get("./sensor/analysis", getAnalysis);
*/

async function getConnection() {
    return await mongodb.MongoClient.connect('mongodb://localhost:27017/zhixingdb_chuhedq');
}

let asyncGetResult = async function (independentSensorId, dependentSensorId, startTime, endTime) {
    let connect = await getConnection();
    let result = [];
    let [independentSensor, dependentSensor] = await Promise.all([getArray.asyncGetSensorMetaAndInstance(independentSensorId),getArray.asyncGetSensorMetaAndInstance(dependentSensorId)]);
    let interval1 = independentSensor.interval;                  // 获取两个传感器间隔时间
    let interval2 = dependentSensor.interval;     // 如果1传感器的间隔时间比较大，
    let collection1 = connect.collection(independentSensor.collectionName);
    let collection2 = connect.collection(dependentSensor.collectionName);
    let [rawData1, rawData2] = await Promise.all([collection1.find({"timestamp": {"$lt": parseFloat(endTime), "$gt": parseFloat(startTime)}}).sort('timestamp', 1).toArray(), collection2.find({"timestamp": {"$lt": parseFloat(endTime), "$gt": parseFloat(startTime)}}).sort('timestamp', 1).toArray()]);  // 获取两个传感器的数据记录
    let [array1, array2] = await Promise.all([getArray.asyncGetArray(rawData1, interval1, independentSensor.key), getArray.asyncGetArray(rawData2, interval2, dependentSensor.key)]);

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
    if (interval1 <= interval2) {
        let Boundary = interval1 / 2;
        let j = 0;
        for (let i = 0; i < array2.length; i++) {
            for (; j < array1.length; j++) {
                if (Math.abs(array2[i][0] - array1[j][0]) < Boundary) {
                    let array = [];
                    array.push(array1[j][1]);
                    array.push(array2[i][1]);
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

    R = parseFloat((Lxy / (Math.sqrt(Lxx) * Math.sqrt(Lyy))).toFixed(9)); // 相关系数  保留

    // R2 = R * R;                                 //判定系数
    // A1 = (count * SumXY - SumX * SumY) / (count * SumXX - SumX * SumX);
    // S1 = A1 * A1 * Lxx;
    // S2 = Lyy - A1 * A1 * Lxx;
    // F1 = S1 / (S2 / (count - 2));                   // 方差分析
    var startpointY = minX * b + a;
    var endpointY = maxX * b + a;
    /* } */
    // console.log(count);
    return { "Correlation": R, "min_X": minX, "max_X": maxX, "startpointY": startpointY, "endpointY": endpointY,  "result": result };
    // return collection.find({}).toArray();
}

router.get("/analysis/result", getAnalysis);
async function getAnalysis(req, res)
{
    /* let sensorId1 = req.query.sensorId1;
    let sensorId2 = req.query.sensorId2;
    console.log(sensorId1 + ' ' + sensorId2); */
    console.log(1111111111);
    const from = new Date(req.query.from) * 1;
    const to = new Date(req.query.to) * 1;
    console.log(from);
    let result = await asyncGetResult('0501', '0701', from, to);
    /* req.send(result); */
    console.log(result);
}

//getAnalysis()

export default router;
