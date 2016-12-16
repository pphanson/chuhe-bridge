import sensors from "../sensors";
import express from "express";
import simulatedata from "../simulation/SensorDataSimulation";
import getAlarmList from "../alarm/getAlarmList";
import getAnalysis from "../analytics/getAnalysis";
import getFft from "../analytics/getFft";
const router = express.Router();

function getSensorsMeta()
{
    const sensorMetas = sensors.getSensorsMeta();
    const result = {};
    for (let meta of sensorMetas)
    {
        result[meta.id] = meta;
    }
    return result;
}

function getSensors() {
    let result = {};
    let s = sensors.getSensors();
    for (let i = 0; i < s.length; i++) {
        let sensor = s[i];
        let metaId = sensor.meta.id;

        if (result[metaId] === null || result[metaId] === undefined) {
            result[metaId] = [];
        }

        result[metaId].push(sensor);
    }
    return result;
}


router.get('/sensors/meta', (req, res) => {
  res.send(getSensorsMeta());
});

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
                  name: item.name
                };
            });
        }
    }
    else {
      result = s[typeParam].map(item => {
          return {
            id: item.id,
            name: item.name
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

router.get("/sensors/simulation",getSensorSimulationHandler);

async function getSensorSimulationHandler(req, res)
{
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    const timeInterval = to * 1 - from * 1;
    let sensortype = req.query.sensortype;
    let s = getSensors();
    let sensors = [];
    let sensor = null;
    let rawValue = null;

    sensors = s[sensortype].map(item => {
        return {
            id: item.id,
            name: item.name,
            interval: item.meta._monitor.interval,
            storage: item.storage
        };
    });

    for (let i = 0; i < sensors.length; i++)
    {
        sensor = sensors[i];
        const dataNumber = Math.round(timeInterval/(sensor.interval));
        for (let j = 0; j < dataNumber; j++) {
            let time = new Date(from * 1+ j*(sensor.interval));
            rawValue = simulatedata(sensortype);
            await sensor.storage._findAndUpdateValue(time, rawValue, sensor.id);
        }
    }
    res.send("OK");
}

router.get("/sensors/alarm",getSensorAlarmHandler);

async function getSensorAlarmHandler(req, res)
{
    let result = {};
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    result = await getAlarmList(from,to);
    res.send(result);
}

router.get("/sensors/analytics", getSensorAnalyticsHandler);

async function getSensorAnalyticsHandler(req, res)
{
    const sensorId1 = req.query.sensorId1;
    const sensorId2 = req.query.sensorId2;
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    let result = await getAnalysis(sensorId1, sensorId2, from, to);
    res.send(result);
}

router.get("/sensors/fft", getSensorFft);

async function getSensorFft(req, res) {
    console.log('aaa');
    const sensorId = req.query.sensorId;
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    console.log(from);
    console.log(to);
    console.log(sensorId);
    let result = await getFft(sensorId, from, to);
    console.log(result);
    res.send(result);
}

export default router;
