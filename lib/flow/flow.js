/**
 * Created by xiong on 2017/1/13.
 */
import storage from "../storage/index";
async function trafficFlow() {
    let startTime = _getHours(new Date(), 0);
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
    for (let i = 0; i < docs.length; i++) {
        count += docs[i].stats.id.total;
        carArray[i] = docs[i].stats.id.total;
        console.log(docs[i].stats.weight.sum);
        sumWeightArray[i] = docs[i].stats.weight.sum;
        for (let j = 0; j < docs[i].values.length; j++) {
            if (docs[i].values[j].weight > 0) {
                if (docs[i].values[j].weight / 1000 <= 10) {
                    weightLevel1++;
                } else if (docs[i].values[j].weight / 1000 <= 20) {
                    weightLevel2++;
                } else if (docs[i].values[j].weight / 1000 <= 30) {
                    weightLevel3++;
                } else if (docs[i].values[j].weight / 1000 <= 40) {
                    weightLevel4++;
                } else if (docs[i].values[j].weight / 1000 <= 50) {
                    weightLevel5++;
                } else if (docs[i].values[j].weight / 1000 <= 55) {
                    weightLevel6++;
                } else if (docs[i].values[j].weight / 1000 <= 60) {
                    weightLevel7++;
                } else if (docs[i].values[j].weight / 1000 <= 70) {
                    weightLevel8++;
                } else {
                    weightLevel9++;
                }
            }
        }
    }
    collectionInsert.insertOne({"timestamp": startTime * 1,
        "total": count,
        "weightLevel1": weightLevel1,
        "weightLevel2": weightLevel2,
        "weightLevel3": weightLevel3,
        "weightLevel4": weightLevel4,
        "weightLevel5": weightLevel5,
        "weightLevel6": weightLevel6,
        "weightLevel7": weightLevel7,
        "weightLevel8": weightLevel8,
        "weightLevel9": weightLevel9,
        "sumweight": sumWeightArray,
        "cars": carArray});
    console.log(sumWeightArray);
}

function setTimeouta() {
    trafficFlow();
    // setTimeout(setTimeouta, (_getHours(new Date(), 1) * 1 - _getHours(new Date(), 0) * 1));
      // setTimeout(setTimeouta, 3000);
}
function _getHours(time, day) {
    if (time) {
        if (arguments.length === 2) {
            console.log('aaa');
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
