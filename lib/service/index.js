import sensors from "../sensors";
import express from "express";
import simulatedata from "../simulation/SensorDataSimulation";
import getAlarmList from "../alarm/getAlarmList";
import getAnalysis from "../analytics/getAnalysis";
import getFft from "../analytics/getFft";
import getAllEvent from "../analytics/event/getAllEvent";
import addEvent from "../analytics/event/addEvent";
import getEventDetails from "../analytics/event/getEventDetail";
import getAlarmStatistics from "../alarm/alarmStatistics";
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
                  name: item.name,
                  meta: item.meta.id
                };
            });
        }
    }
    else {
      result = s[typeParam].map(item => {
          return {
            id: item.id,
            name: item.name,
            meta: item.meta.id
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

router.get("/sensors/simulation", getSensorSimulationHandler);

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

router.get("/sensors/alarm", getSensorAlarmHandler);

async function getSensorAlarmHandler(req, res)
{
    let result = {};
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    result = await getAlarmList(from, to);
    res.send(result);
}

router.get("/sensors/alarmstatistics", getAlarmStatistic);

async function getAlarmStatistic(req, res) {
    let result = {};
    let from = req.query.from;
    const to = req.query.to;
    result = await getAlarmStatistics(from, to);
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

async function getSensorFft(req, res)
{
    const sensorId = req.query.sensorId;
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    let result = await getFft(sensorId, from, to);
    res.send(result);
}

router.get("/event/allevent", getAllEvents);

async function getAllEvents(req, res) {
    const from = req.query.from;
    const to = req.query.to;
    const page = req.query.page;
    let keywords = req.query.keywords;
    let result = await getAllEvent(from, to, page, keywords);
    res.send(result);
}
router.post("/event/addevent", addEvents);

async function addEvents(req, res) {
    let eventTypeIds = req.body.eventTypeId;
    let eventTypeId = eventTypeIds.split(",");
<<<<<<< HEAD
    let temp = null;
    for (let i = 0; i < eventTypeId.length; i++) {
        req.body.eventTypeId = eventTypeId[i];
        temp = await addEvent(req);
    }
    let result = {
        "result": temp
    }
    res.send(result.result);
=======
    let result = null;
    for (let i = 0; i < eventTypeId.length; i++) {
        req.body.eventTypeId = eventTypeId[i];
        result = await addEvent(req);
    }
    res.send(result);
>>>>>>> 851ca93debe5b59733176f7612398825e48979f9
}

router.get("/event/eventdetail", getEventDetail);

async function getEventDetail(req, res) {
    const from = req.query.from;
    const to = req.query.to;
    const sensorId = req.query.sensorId;
    let result = await getEventDetails(from, to, sensorId);
    res.send(result);
}

export default router;
