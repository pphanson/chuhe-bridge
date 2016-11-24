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
    return $.ajax({
        url: "http://localhost:3000/sensors/data/stats",
        dataType: 'json',
        type: 'POST',
        data: {
            sensors: JSON.stringify([id]),
            from: from,
            to: to
        }
    });
}

module.exports = {
  fetchSensors,
  fetchSensorStats,
  fetchSensorData
};
