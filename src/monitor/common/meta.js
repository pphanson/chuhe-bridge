const requestUtil = require('./remote');
let meta;
/**
 * 获取传感器元数据
 */
requestUtil.fetchSensorsMeta().then(data => {
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
          now.getDate() - 1,
          23,
          59,
          59
      )
    ];
}


/**
 * 根据传感器类型 ID 获取监测时间范围
 */
function createCurrentTimeRange(sensorType)
{
    const interval = getSensorMonitorInterval(sensorType);
    const now = new Date();
    if (interval === 60 * 1000) // 1 minutes
    {
        return [
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              now.getHours()
            ),
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              now.getHours(),
              59
            )
        ];
    }
    else if (interval === 60 * 60 * 1000) // 1 hours
    {
        return [
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            ),
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              23
            )
        ];
    }
    else if (interval === 5 * 1000) // 5 seconds
    {
        return [
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              now.getHours(),
              now.getMinutes()
            ),
            new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              now.getHours(),
              now.getMinutes() + 5
            )
        ];
    }
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

module.exports = {
  getSensorMetaName,
  getSensorMonitorInterval,
  createCurrentTimeRange,
  createHistoryTimeRange,
  getTimestamp,
  getSensorValues
};
