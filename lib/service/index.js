import sensors from "../sensors";
import express from "express";

const router = express.Router();


function getSensors() {
    let result = {};
    let s = sensors.getSensors();
    for (let i = 0; i < s.length; i++) {
        let sensor = s[i];
        let type = sensor.meta.name;

        if (result[type] === null || result[type] === undefined) {
            result[type] = [];
        }

        result[type].push(sensor);
    }
    return result;
}


router.get("/sensors/data", (req, res) => {
    let s = getSensors();
    let typeParam = req.query.type;
    let result = {};
    if (typeParam === null || typeParam === undefined || typeParam === '')
    {
        for (let type in s)
        {
            result[type] = s[type].map(item => {
                return {
                  id: item.id,
                  name: "sensor_" + item.id
                };
            });
        }
    }
    else {
      result = s[typeParam].map(item => {
          return {
            id: item.id,
            name: "sensor_" + item.id
          };
      });
    }
    res.send(result);
});

router.post("/sensors/data/stats", postSensorStatsHandler);


async function postSensorStatsHandler(req, res)
{
    const reqSensors = JSON.parse(req.body.sensors);
    const from = req.body.from;
    const to = req.body.to;
    let result = await getSensorStats(reqSensors, from, to);
    res.send(result);
}

async function getSensorStats(sensorIds, from, to)
{
    let result = {};
    const s = sensors.getSensors();
    for (let sensorId of sensorIds)
    {
        let i = await s[sensorId].storage.queryStats(new Date(from), new Date(to));
        result[sensorId] = i;
    }
    return result;
}

export default router;
