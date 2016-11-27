const BridgeScene = require('./common/bridge');
const Gauge = require('./common/gauge');
const LineChart = require('./common/lineChart');
const requestUtil = require('./common/remote');


let seriesCollection = [];
let values;
let value;
let lineChart;
let id;

function renderSensorList(data) {
    let $list = $('div.chuhe-monitor ul#chuhe-monitor-dropdown');
    for (let item of data) {
        let $li = $(`<li id=${item.id}><a href='#${item.id}'><span>${item.name}</span></a></li>`).data(item);
        $list.append($li);
    }

    $list.on('click', 'li', e => {
        selectSensor($(e.currentTarget))
    });
}

function selectSensor($li) {
    let item = $li.data();

    let $selectedLi = $('div.chuhe-monitor ul#chuhe-monitor-dropdown > li.selected');
    $selectedLi.removeClass('selected');

    $li.addClass('selected');
    $('div.chuhe-monitor a#chuhe-sensor-title').html(`${item.name}<i class="mdi-navigation-arrow-drop-down right">`);
    id = item.id;
    let from = (new Date(1479546000000)).toJSON();
    let to = (new Date(1479556800000)).toJSON();

    //获取昨日统计值
    requestUtil.fetchSensorStats(id, from, to).then(data => {
        refreshSensorStats(id, data);
    });

    //获取昨日统计值
    requestUtil.fetchSensorStats(id, from, to).then(data => {
        refreshSensorStats(id, data);
    });

    //获取昨日同期监控数据
    requestUtil.fetchSensorData(id, from, to).then(data => {
        refreshLineChart(data);
    });
}


function refreshSensorStats(id, data) {
    let stats = data[id].stats;
    let $card = $('div.chuhe-monitor  div.chuhe-history-stats > div.chuhe-stats-card');
    if (value !== null && value !== undefined && stats !== null && stats !== undefined && stats[value] !== null && stats[value] !== undefined) {
        $card.find("div.card-avg-item > div.card-item-value > span").text(stats[value].avg.toFixed(2));
        $card.find("div.card-max-item > div.card-item-value > span").text(stats[value].max.toFixed(2));
        $card.find("div.card-min-item > div.card-item-value > span").text(stats[value].min.toFixed(2));
    }
    else {
        $card.find("div.card-item > div.card-item-value > span").text("-")
    }
}

function generateSeries() {
    let series;
    if ($.isArray(values) && values.length > 0)
    {
        for (let i of values)
        {
            series = {
              data: [],
              value: i
            };
            seriesCollection.push(series);
        }
    }
    else if (value != null)
    {
        series = {
          data: [],
          value
        };
        seriesCollection.push(series);
    }
}

function resetSeriesCollection()
{
    for (let series of seriesCollection)
    {
        series.data = [];
    }
}

function refreshLineChart(data) {
    resetSeriesCollection();
    data.forEach(function(item, index) {
        for (let series of seriesCollection)
        {
            let key = series.value;
            series.data.push([index, item[key] === Number.MIN_SAFE_INTEGER ? 2 : item[key]]);
        }
    });
    lineChart.setData(seriesCollection);
    lineChart.setupGrid();
    lineChart.draw();
}


module.exports = function(options) {
    const type = options.type;
    const unit = options.unit;
    value = options.value;
    values = options.values;
    const match = window.location.href.match(/#(.*)$/);
    id = match ? match[1] : '';
    $('div.chuhe-monitor a#chuhe-sensor-title').html(`${'sensor_' + id}<i class="mdi-navigation-arrow-drop-down right">`);

    if ($.isArray(values) && values.length > 1)
    {
        $(`div.chuhe-monitor ul.chuhe-linechart-value-switch > li#${value}`).addClass('selected');
    }
    else {
        $(`div.chuhe-monitor ul.chuhe-linechart-value-switch`).hide();
    }

    let bridgeScene = BridgeScene();
    bridgeScene.on('load', function(){
      this.bridge.showSensors([id]);
      alert(`sensor#${id}`);
      this.bridge.focusOnSensor(this.bridge.sensors[`sensor#${id}`]);
    });


    let gauge = Gauge({
        unit
    });
    lineChart = LineChart();


    generateSeries();

    //获取指定类型传感器列表
    requestUtil.fetchSensors(type).then(data => {
        renderSensorList(data);
    });

    let from = (new Date(1479546000000)).toJSON();
    let to = (new Date(1479556800000)).toJSON();

    //获取昨日统计值
    requestUtil.fetchSensorStats(id, from, to).then(data => {
        refreshSensorStats(id, data);
    });

    //获取昨日同期监控数据
    requestUtil.fetchSensorData(id, from, to).then(data => {
        refreshLineChart(data);
    });

    return {
        id,
        bridgeScene,
        gauge,
        lineChart
    };
}
