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
import getHistory from "../analytics/history/getHistory";
import getEvent from "../analytics/event/Event";
import getTraffic from "../analytics/traffic/traffic";
import getFlow from "../analytics/flow/getFlow";
// import getWord from "../analytics/office/word";
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
    // console.log("xxxxx");
    let s = sensors.getSensors();

    for (let i = 0; i < s.length; i++) {
        if (s[i] === undefined) {
            break;
        } else {
            let sensor = s[i];
            let metaId = sensor.meta.id;

            if (result[metaId] === null || result[metaId] === undefined) {
                result[metaId] = [];
                // console.log(sensor);
            }
            result[metaId].push(sensor);
        }

    }
    return result;
}

router.get('/sensors/meta', (req, res) => {
  res.send(getSensorsMeta());
});

router.get("/sensors/data", (req, res) => {
    let s = getSensors();
     // console.log(s);
    let typeParam = req.query.type;
    console.log(typeParam);
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
            result[type] = result[type].sort(compare("id"));
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
      result = result.sort(compare("id"));
    }
    res.send(result);
});

function compare(propertyName) {
    return function (object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];
        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    }
}
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
        let sinvalue = 0; // 生成正弦波数据的时间间隔
        sensor = sensors[i];
        const dataNumber = Math.round(timeInterval/(sensor.interval));
        for (let j = 0; j < dataNumber; j++) {
            let time = new Date(from * 1+ j*(sensor.interval));
            rawValue = simulatedata(sensortype,sinvalue);
            sinvalue += 30;
            if(sinvalue > 360)
            {
                sinvalue = 0;
            }
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
    const page = req.query.page;
    const level = req.query.level;
    const alarmType = req.query.alarmType;
    const keyword = req.query.keyword;
    result = await getAlarmList(from, to, page, level, alarmType, keyword);
    res.send(result);
}

router.get("/sensors/alarmstatistics", getAlarmStatistic);

async function getAlarmStatistic(req, res) {
    let result = {};
    let from = new Date(req.query.from);
    const to = new Date(req.query.to);
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
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    const page = req.query.page;
    let keywords = req.query.keywords;
    let result = await getAllEvent(from, to, page, keywords);
    res.send(result);
}
router.post("/event/addevent", addEvents);

async function addEvents(req, res) {
    let eventTypeIds = req.body.eventTypeId;
    let eventTypeId = null;
    let temp = null;
    let result = {};
    if (eventTypeIds) {
        eventTypeId = eventTypeIds.split(",");
        for (let i = 0; i < eventTypeId.length; i++) {
            req.body.eventTypeId = eventTypeId[i];
            temp = await addEvent(req);
        }
        result = {
            "result": temp
        };
    } else {
        result = {
            result: "事件类型不能为空"
        };
    }
    res.send(result.result);
}

router.get("/event/eventdetail", getEventDetail);

async function getEventDetail(req, res) {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    const sensorId = req.query.sensorId;
    let result = await getEventDetails(from, to, sensorId);
    res.send(result);
}

router.get("/sensors/history", getSensorHistory);

async function getSensorHistory(req, res) {
    const from = new Date(req.query.from);
    const to = new Date(req.query.to);
    const sensorId = req.query.sensorId;
    let result = await getHistory(from, to, sensorId);
    res.send(result);
}

router.get("/event/event", getEvents);

async function getEvents(req, res) {
    const id = req.query.id;
    let result = await getEvent(id);
    res.send(result);
}

router.get("/event/traffic", getTraffics);

async function getTraffics(req, res) {
    let result = await getTraffic();
    res.send(result);
}

router.get("/event/getflow", getFlows);

async function getFlows(req, res) {
    let result = await getFlow();
    res.send(result);
}

router.get("/getword", getWords);
async function getWords(req, res) {
    let result = await getWord();
    res.send("aaa");
}
export default router;
