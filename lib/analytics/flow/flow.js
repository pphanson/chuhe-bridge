/**
 * Created by xiong on 2017/1/13.
 */
import storage from "../../storage/index";
async function trafficFlow() {
    let hourTime = 1000 * 60 * 60;
    let startTime = _getHours(new Date(), -4);
    let connect = storage.connection.internalConnection;
    let collection = connect.collection("sensor-0901");
    let collectionInsert = connect.collection("traffic_flow");
    let count = 0;
    let carArray = [];
    let sumWeightArray = [];
    let weightLevel1 = 0;
    let weightLevel2 = 0;
    let weightLevel3 = 0;
    let weightLevel4 = 0;
    let weightLevel5 = 0;
    let weightLevel6 = 0;
    let weightLevel7 = 0;
    let weightLevel8 = 0;
    let weightLevel9 = 0;
    let docs = await collection.find({"timestamp": {$gt: startTime * 1}}).sort({"timestamp": 1}).toArray();
    let j = 0;
    for (let i = 0; i < 24; i++) {              // 按照24小时，获得每小时的统计车辆数量，重量，以及每小时重量等级
        let temptime = startTime * 1 + hourTime * i;
        if (j !== docs.length) {
            for (j; j < docs.length; j++) {
                if (temptime === docs[j].timestamp) {
                    carArray.push(docs[j].stats.id.total);
                    sumWeightArray.push(docs[j].stats.weight.sum);
                    for (let k = 0; k < docs[j].values.length; k++) {
                        if (docs[j].values[k].weight > 0) {
                            if (docs[j].values[k].weight / 1000 <= 10) {
                                weightLevel1++;
                            } else if (docs[j].values[k].weight / 1000 <= 20) {
                                weightLevel2++;
                            } else if (docs[j].values[k].weight / 1000 <= 30) {
                                weightLevel3++;
                            } else if (docs[j].values[k].weight / 1000 <= 40) {
                                weightLevel4++;
                            } else if (docs[j].values[k].weight / 1000 <= 50) {
                                weightLevel5++;
                            } else if (docs[j].values[k].weight / 1000 <= 55) {
                                weightLevel6++;
                            } else if (docs[j].values[k].weight / 1000 <= 60) {
                                weightLevel7++;
                            } else if (docs[j].values[k].weight / 1000 <= 70) {
                                weightLevel8++;
                            } else {
                                weightLevel9++;
                            }
                        }
                    }
                    count += docs[j].stats.id.total;
                    j++;
                    break;
                } else {
                    carArray.push(0);
                    sumWeightArray.push(0);
                    break;
                }
            }
        } else {
            carArray.push(0);
            sumWeightArray.push(0);
        }
    }
    let weightLevel = [weightLevel1, weightLevel2, weightLevel3, weightLevel4, weightLevel5, weightLevel6,
        weightLevel7, weightLevel8, weightLevel9];
    collectionInsert.insertOne({"timestamp": startTime * 1,
        "total": count,
        "weight": weightLevel,
        "sumWeightArray": sumWeightArray,
        "cars": carArray});
    console.log('ok');
}

async function setTimeouta() {
    trafficFlow();
    setTimeout(setTimeouta, (_getHours(new Date(), 1) * 1 - _getHours(new Date(), 0) * 1));
    // setTimeout(setTimeouta, 3000);
}
function _getHours(time, day) {
    if (time) {
        if (arguments.length === 2) {
            return new Date(
                time.getFullYear(),
                time.getMonth(),
                time.getDate() + day);
        } else {
            return new Date(
                time.getFullYear(),
                time.getMonth(),
                time.getDate(),
                time.getHours());
        }
    } else {
        return null;
    }
}

export default setTimeouta;
