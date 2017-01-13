const io = require('socket.io-client');
let client = {};

function startMonitor(id, value, stats)
{
    if (!client[id])
    {
        client[id] = io('http://localhost:3000/api/sensor/' + id);
        if ($.isFunction(value))
        {
            client[id].on("value", value);
        }

        if ($.isFunction(stats))
        {
            client[id].on("stats", stats);
        }

    }
    client[id].connect();
}

function stopMonitor(id)
{
    if (client[id])
    {
        client[id].disconnect();
    }
}

/**
 *获取某个传感器实例在某段区间的所有监控数据
 */
 function fetchSensorData(id, from, to)
 {
    return $.ajax({
        url: 'http://localhost:3000/api/sensor/' + id + '/data',
        dataType: 'json',
        data: {
            from: from,
            to: to
        }
    });
 }

/**
 * fft参数传入
 */
function getAnalytics(id, from, to)
{
    return $.ajax({
        url: 'http://localhost:3000/sensors/fft/',
        dataType: 'json',
        data: {
            sensorId: id,
            from: from,
            to: to
        }
    });
}

/**
 * 相关性参数传入
 */
function getCorrelation(sensorId1, sensorId2, from, to)
{
    return $.ajax({
        url: 'http://localhost:3000/sensors/analytics/',
        dataType: 'json',
        data: {
            sensorId1: sensorId1,
            sensorId2: sensorId2,
            from: from,
            to: to
        }
    });
}

/**
 * 根据传感器类型获取传感器列表
 */
function fetchSensors(type)
{
    return $.ajax({
        url: 'http://localhost:3000/sensors/data',
        dataType: 'json',
        data: {
            type: type
        }
    });
}

/**
 * 获取某段时间区间内某个传感器实例的统计值
 */
function fetchSensorStats(id, from, to)
{
    let ids;
    if ($.isArray(id))
    {
        ids = id;
    }
    else {
        ids = [id];
    }
    return $.ajax({
        url: "http://localhost:3000/sensors/data/stats",
        dataType: 'json',
        type: 'POST',
        data: {
            sensors: JSON.stringify(ids),
            from: from,
            to: to
        }
    });
}

/**
 * 新建特殊事件
 */
function addNewEvents(startTime, endTime, eventName, eventTypeId, _id)
{
    return $.ajax({
        url: 'http://localhost:3000/event/addevent',
        type: 'POST',
        data: {
            startTime: startTime,
            endTime: endTime,
            eventName: eventName,
            eventTypeId: eventTypeId,
            id:_id
        },
    });
}

/**
 * 获取所有特殊事件的列表
 */
function getAllEvents(from, to, page, keywords)
{
    return $.ajax({
        url: 'http://localhost:3000/event/allevent',
        data: {
            from: from,
            to: to,
            page: page,
            keywords:keywords
        }
    });
}

/**
 * 获取搜索事件列表
 */
function getSearchTable(from, to, page, keywords)
{
    return $.ajax({
        url: 'http://localhost:3000/event/allevent',
        data: {
            from: from,
            to: to,
            page: page,
            keywords: keywords
        }
    });
}

/**
 * 事件详情
 */
function getSpecialDetail(from, to, id)
{
    return $.ajax({
        url: 'http://localhost:3000/event/eventdetail',
        data: {
            from: from,
            to: to,
            sensorId: id
        }
    });
}

/**
 * 修改记录
 */
function getchanged(_id)
{
    return $.ajax({
        url: 'http://localhost:3000/event/event',
        data: {
            id:_id
        }
    });
}

/**
 * 获取传感器类型
 */
function fetchSensorsMeta()
{
    return $.ajax({
        url: 'http://localhost:3000/sensors/meta',
        dataType: 'json',
        async: false
    });
}

/**
 * 获取报警统计数据
 */
function getAlarmDate(from, to, page, level, alarmType, keyword)
{
    return $.ajax({
        url: 'http://localhost:3000/sensors/alarm',
        data: {
            from: from,
            to: to,
            page: page,
            level: level,
            alarmType: alarmType,
            keyword: keyword
        }
    });
}

/**
 * 获取报警统计数据
 */
function getAlarmStatistics(from, to, page)
{
    return $.ajax({
        url: 'http://localhost:3000/sensors/alarmstatistics',
        data: {
            from: from,
            to: to,
        }
    });
}

/**
 * 获取单个传感器的历史数据
 */
function getHistoryDate(from, to, sensorId)
{
    return $.ajax({
        url: 'http://localhost:3000/sensors/history',
        data: {
            from: from,
            to: to,
            sensorId: sensorId,
        }
    });
}

/**
 * 荷载数据
 */
function getTrafficLoad()
{
    return $.ajax({
        url: 'http://localhost:3000/event/traffic',
        type: 'GET',
    });
}

/**
 * 荷载数据
 */
function getTrafficMonth()
{
    return $.ajax({
        url: 'http://localhost:3000/event/traffic',
        type: 'GET',
    });
}

module.exports = {
    fetchSensors,
    fetchSensorStats,
    fetchSensorData,
    startMonitor,
    stopMonitor,
    getAnalytics,
    fetchSensorsMeta,
    getCorrelation,
    addNewEvents,
    getAllEvents,
    getSearchTable,
    getAlarmDate,
    getAlarmStatistics,
    getHistoryDate,
    getSpecialDetail,
    getchanged,
    getTrafficLoad,
    getTrafficMonth,
};
