const BridgeScene = require('./common/bridge');
const Gauge = require('./common/gauge');
const LineChart = require('./common/lineChart');
const requestUtil = require('./common/remote');
const series = require('./common/series');
const Meta = require('./common/meta');

let type;
let id;
let collection = [];
let values;
let value;
let historyStats;
let lineChart;
let gauge;
let interval;
let from;
let to;


/**
 * 渲染传感器列表
 */
function renderSensorList(data) {
    let $list = $('div.chuhe-monitor ul#chuhe-monitor-dropdown');
    for (let item of data) {
        let $li = $(`<li id=${item.id}><a href='#${item.id}'><span>${item.name}</span></a></li>`).data(item);
        $list.append($li);

        if (item.id === id)
        {
            $('div.chuhe-monitor a#chuhe-sensor-title').html(`${item.name}<i class="mdi-navigation-arrow-drop-down right">`);
        }
    }
    $list.on('click', 'li', (e) => {
        selectSensor($(e.currentTarget));
    });
}

function fetchSensorData()
{
    const historyTimeRange = Meta.createHistoryTimeRange();
    const timeRange = Meta.createCurrentTimeRange(type);
    // 获取昨日统计值
    requestUtil.fetchSensorStats(id, historyTimeRange[0].toJSON(), historyTimeRange[1].toJSON()).then((data) => {
        historyStats = data[id];
        refreshSensorStats(id, data);
    });

    requestUtil.fetchSensorData(id, timeRange[0].toJSON(), timeRange[1].toJSON()).then((data) => {
        refreshLineChart(data);
        requestUtil.startMonitor(id, (data) => {
            updateRealTimeData(data);
        }, (data) => {
            refreshSensorStats(id, data, 'current');
        });
    });
}

/**
 * 选择传感器
 */
function selectSensor($li) {
    // 更新选中传感器
    const item = $li.data();
    const $selectedLi = $('div.chuhe-monitor ul#chuhe-monitor-dropdown > li.selected');
    $selectedLi.removeClass('selected');
    $li.addClass('selected');
    $('div.chuhe-monitor a#chuhe-sensor-title').html(`${item.name}<i class="mdi-navigation-arrow-drop-down right">`);

    // 停止之前传感器监控
    requestUtil.stopMonitor(id);

    // 开启选中传感器监控
    id = item.id;
    collection = series({
        from,
        to,
        values,
        interval
    });
    fetchSensorData();
}


function refreshSensorStats(id, data, classify = 'history') {
    const stats = data[id] ? data[id] : data;
    let $card = $(`div.chuhe-monitor  div.chuhe-${classify}-stats > div.chuhe-stats-card`);
    if (value !== null && value !== undefined && stats !== null && stats !== undefined && stats[value] !== null && stats[value] !== undefined) {

        $card.find("div.card-max-item > div.card-item-value > span").text(stats[value].max.toFixed(2));
        $card.find("div.card-min-item > div.card-item-value > span").text(stats[value].min.toFixed(2));
        $card.find("div.card-avg-item > div.card-item-value > span").text(stats[value].avg.toFixed(2));
    } else {
        $card.find("div.card-item > div.card-item-value > span").text("-");
    }
}

/**
 * 获取所有的值
 */
function refreshLineChart(data) {
    data.forEach(function(item, index) {
        for (let key in item)
        {
            // let a = collection[key].data[index-1][1];
            collection[key].data[index] = [from.getTime() + interval * index, item[key] === Number.MIN_SAFE_INTEGER ? collection[key].data[index-1][1] : item[key]];
        }
    });
    lineChart.setData([collection[value]]);
    lineChart.setupGrid();
    lineChart.draw();
}

/**
 * 切换监控参数
 */
function switchValue($li) {
    const $selectedLi = $(`div.chuhe-monitor ul.chuhe-linechart-value-switch > li.selected`);
    const v = $li.attr('id');
    $selectedLi.removeClass('selected');

    $li.addClass('selected');
    value = v;
    lineChart.setData([collection[value]]);
    lineChart.setupGrid();
    lineChart.draw();
    refreshSensorStats(id, historyStats);
}

/**
 * 更新 series 更新最新的值
 */
function updateRealTimeData(data) {
    let timestamp = Meta.getTimestamp(new Date(data.lastUpdatedTime), from, type);
    let timeslot =  (timestamp - from) / interval;
    for (let v of values) {
        if (timestamp < to) {
            if (collection[v].data[timeslot][1] === null) {
                collection[v].data[timeslot][1] = data.value[v];
            }
        } else {
            let deprecatedCount = (timestamp - to) / interval + 1;
            collection[v].data.splice(0, deprecatedCount);

            for (let t = to.getTime(); t < timestamp.getTime(); t += interval)
            {
                collection[v].data.push([timestamp.getTime(), Math.random()*100]);
            }
            collection[v].data.push([timestamp.getTime(), data.value[v]]);
            to = new Date(timestamp.getTime() + interval) ;
            from = new Date(collection[v].data[0][0]);
        }
    }

    lineChart.setData([collection[value]]);
    lineChart.setupGrid();
    lineChart.draw();

    gauge.refresh(data.value[value]);
}

module.exports = function(options) {
    type = options.type;
    const unit = options.unit;
    const min = options.min;
    const max = options.max;
    value = options.value;
    values = options.values ? options.values: [options.value];
    interval = Meta.getSensorMonitorInterval(type);
    const match = window.location.href.match(/#(.*)$/);
    id = match ? match[1] : '';

    $(`div.chuhe-monitor ul.chuhe-linechart-value-switch`).on('click', 'li', e => {
        switchValue($(e.currentTarget));
    });
    if ($.isArray(values) && values.length > 1) {
        $(`div.chuhe-monitor ul.chuhe-linechart-value-switch > li#${value}`).addClass('selected');
    } else {
        $(`div.chuhe-monitor ul.chuhe-linechart-value-switch`).hide();
    }

    const bridgeScene = BridgeScene();

    const timeRange = Meta.createCurrentTimeRange(type);
    from = timeRange[0];
    to = timeRange[1];

    gauge = Gauge({
        unit,
        min,
        max,
    });

    collection = series({
        from,
        to,
        values,
        interval
    });

    lineChart = LineChart({
        from,
        to,
        interval,
        collection
    });

    if (id !== null && id !== undefined)
    {
        fetchSensorData();
    }
    // 获取指定类型传感器列表
    requestUtil.fetchSensors(type).then((data) => {
        renderSensorList(data);
        const ids = data.map((d) => {
            return d.id;
        });
        setTimeout(() => {
            bridgeScene.bridge.showSensors(ids);
            //bridgeScene.bridge.focusOnSensor(bridgeScene.bridge.sensors[`sensor#${id}`]);
        }, 500);

        if (id === null || id === undefined || id === '')
        {
            id = ids.length > 0 ? ids[0] : null;
            if (id)
            {
                fetchSensorData();
                let selectedSensor = data.filter(function(d){
                  return d.id === id;
                });

                $('div.chuhe-monitor a#chuhe-sensor-title').html(`${selectedSensor[0].name}<i class="mdi-navigation-arrow-drop-down right">`);
                window.location.hash = id;
            }
        }
    });


    return {
        id,
        bridgeScene,
        gauge,
        lineChart
    };
}
