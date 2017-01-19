const requestUtil = require('./remote');
let meta;
/**
 * 获取传感器元数据
 */
requestUtil.fetchSensorsMeta().then((data) => {
    meta = data;
});


/**
 * 根据传感器类型 ID 获取传感器采集频率
 */
function getSensorMonitorInterval(sensorType)
{
    const sensorMeta = meta[sensorType];
    return sensorMeta.monitor.interval;
}

/**
 * 根据传感器类型 ID 获取传感器类型名称
 */
function getSensorMetaName(sensorType)
{
    const sensorMeta = meta[sensorType];
    return sensorMeta.name;
}

function createHistoryTimeRange()
{
    const now =  new Date();
    return [
      new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1
      ),
      new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
      )
    ];
}


function normalizeTimestamp(date, interval)
{
    if (interval <= 0 || interval > 1000 * 60 * 60 || 1000 * 60 * 60 % interval !== 0)
    {
        throw new Error('无效的采集频率');
    }

    const  d = date.getTime() % interval;
    return new Date(date.getTime() - d);
}

/**
 * 根据传感器类型 ID 获取监测时间范围
 */
function createCurrentTimeRange(sensorType)
{
    const interval = getSensorMonitorInterval(sensorType);
    const now = new Date();
    if (interval > 1000 * 60 * 60 || 1000 * 60 * 60 % interval !== 0)
    {
        throw new Error(`${sensorType} 类型传感器采集频率数值无效`);
    }

    const to = normalizeTimestamp(now, interval);
    const from = new Date(to.getTime() - interval * 60);
    return [from, to];
  }


/**
 * 获取时间戳
 */
function getTimestamp(time, from, sensorType)
{
    const interval = this.getSensorMonitorInterval(sensorType);
    const index = Math.floor((time - from) / interval);
    return new Date(from.getTime() + index * interval);
}

function getSensorValues(sensorType)
{
    const sensorMeta = meta[sensorType];
    const values = sensorMeta.values;
    return Object.keys(values)
}


function getTypes()
{
    return Object.keys(meta);
}

module.exports = {
    getSensorMetaName,
    getSensorMonitorInterval,
    createCurrentTimeRange,
    createHistoryTimeRange,
    getTimestamp,
    getSensorValues,
    getTypes
};
