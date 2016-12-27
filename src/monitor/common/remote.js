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
function addNewEvents(startTime, endTime, eventName, eventTypeId)
{
    return $.ajax({
        url: 'http://localhost:3000/event/addevent',
        type: 'POST',
        data: {
            startTime: startTime,
            endTime: endTime,
            eventName: eventName,
            eventTypeId: eventTypeId
        },
        success:function (data, status) {//请求成功的回调函数
            console.log(data);
            if (data === "success") {
                alert("插入成功");
            } else if (data === "fail"){
                alert("插入失败");
            }
        }
    });
}

/**
 * 获取所有特殊事件的列表
 */
function getAllEvents(from, to, page)
{
    return $.ajax({
        url: 'http://localhost:3000/event/allevent',
        data: {
            from: from,
            to: to,
            page: page
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
    getSearchTable
};
