require('./style.less');

const series = require('../monitor/common/series');
const map = require('./map');
const bridgeScene =require('./bridge');
const LineChart = require('./lineChart.js');
const RequestUtil = require('../monitor/common/remote');
const Meta = require('../monitor/common/meta');
const now = new Date();
const sensorTypes = Meta.getTypes();
const excludeSensorTypes = ['09', '07'];
const timeRange = {};
const collection = {};
const lineCharts = {};
const colors = {
    '04': '#6da3f7',
    '01': '#36fff9',
    '03': '#ff39b8',
    '02': '#00c3ff',
    '06': '#43ff8f',
    '05': '#1fd5ff',
    '08': '#80b4ff',
};
const fills = {
    '04': ['rgba(85, 158, 238, 0.1)', 'rgb(85, 158, 238)'],
    '01': ['rgba(0, 218, 148, 0.1)', 'rgb(0, 218, 148)'],
    '03': ['rgba(255, 10, 255, 0.1)', 'rgb(255, 10, 255)'],
    '02': ['rgba(0, 193, 186, 0.1)', 'rgb(0, 193, 186)'],
    '06': ['rgba(131, 266, 149, 0.1)', 'rgb(131, 266, 149)'],
    '05': ['rgba(86, 174, 254, 0.1)', 'rgb(86, 174, 254)'],
    '08': ['rgba(125, 186, 198, 0.1)', 'rgb(125, 186, 198)'],
}

for (let type of sensorTypes)
{
    if (!excludeSensorTypes.includes(type))
    {
        timeRange[type] = Meta.createCurrentTimeRange(type);
    }
}

for (let type of sensorTypes)
{
  if (!excludeSensorTypes.includes(type))
  {
      let color = colors[type];
      collection[type] = series({'from': timeRange[type][0], 'to': timeRange[type][1], 'values': Meta.getSensorValues(type), 'interval': Meta.getSensorMonitorInterval(type), 'color': colors[type]});
  }
}

for (let type of sensorTypes)
{
    if (!excludeSensorTypes.includes(type))
    {
        lineCharts[type] = LineChart(Meta.getSensorMetaName(type), collection[type], {colors: fills[type]});
    }
}

bridgeScene.on("load", function(e) {
    let sensorIds = Object.values(selectedSensors);
    this.bridge.showSensors(sensorIds);
});

///////////////// sensor card ///////////////////////////
let selectedSensors = {};

function initSensorlist(type, data) {
    var $ul = $(`ul#${Meta.getSensorMetaName(type)}-card-dropdown`);
    data.forEach((item, index) => {
        let $li = $(`<li id=${item.id}><a href='#'><span>${item.name}</span></a></li>`);
        $li.data(item);
        $ul.append($li);
        if (index === 0) {
            selectSensorItem(item, true);
        }
    });
    $ul.on('click', 'li', function(e) {
        selectSensorItem($(e.currentTarget).data(), true);
    });
}


function refreshRealValue(sensor, data)
{
    const type = sensor.meta;
    const name = Meta.getSensorMetaName(type);
    const v = Meta.getSensorValues(type)[0];

    if (type === '07')
    {
        $('div.chuhe-temperature > div.chuhe-th-value > span:first-child').text(data.value.temperature);
        $('div.chuhe-humidity > div.chuhe-th-value > span:first-child').text(data.value.humidity);
        return;
    }
    else if (type === '04')
    {
        $(`div.chuhe-value > div.chuhe-value-item.strain > span`).text(data.value["strain"].toFixed(2));
    }

    let timestamp = Meta.getTimestamp(new Date(data.lastUpdatedTime), timeRange[type][0], type);
    const lineChart = lineCharts[type];
    const col = collection[type];


    let $card = $(`div#${name}-card.chuhe-card #${name}-card-current-number`);
    $card.text(data.value[v].toFixed(2));

    if (type === '09')
    {
        return;
    }
    if (timestamp < timeRange[type][1]) {
        let timeslot = Math.floor((timestamp - timeRange[type][0]) / Meta.getSensorMonitorInterval(type));
        if (col[v].data[timeslot][1] === null) {
            col[v].data[timeslot][1] = data.value[v];
        }
    } else {
        let deprecatedCount = (timestamp - timeRange[type][1]) / Meta.getSensorMonitorInterval(type) + 1;
        col[v].data.splice(0, deprecatedCount);

        for (let t = timeRange[type][1].getTime(); t < timestamp.getTime(); t += Meta.getSensorMonitorInterval(type) )
        {
            col[v].data.push([timestamp.getTime(), null]);
        }
        col[v].data.push([timestamp.getTime(), data.value[v]]);
        timeRange[type][1] = new Date(timestamp.getTime() + Meta.getSensorMonitorInterval(type));
        timeRange[type][0] = new Date(col[v].data[0][0]);
    }

    lineChart.setData([col[v]]);
    lineChart.setupGrid();
    lineChart.draw();
}

function refreshHistoryValue(sensor, data)
{
    const id = sensor.id;
    const type = sensor.meta;
    const name = Meta.getSensorMetaName(type);
    const value = Meta.getSensorValues(type)[0];
    if (type === '07')
    {
        return;
    }
    else {
        const $card = $(`div#${name}-card.chuhe-card #${name}-card-history-number`);
        $card.html(data[id] && data[id][value] && data[id][value].max ? data[id][value].max.toFixed(2) : '&ndash;');
    }
}


function fetchSensorData(sensor)
{
    const historyTimeRange = Meta.createHistoryTimeRange();
    const type = sensor.meta;
    const name = Meta.getSensorMetaName(sensor.meta);
    RequestUtil.fetchSensorStats(
      sensor.id,
      historyTimeRange[0].toJSON(),
      historyTimeRange[1].toJSON()
    ).then((data) => {
        refreshHistoryValue(sensor, data);
    });

    RequestUtil.getSensorCurrentValue(sensor.id).then((data) => {
        const v = Meta.getSensorValues(type)[0];
        if (type === '07')
        {
            $('div.chuhe-temperature > div.chuhe-th-value > span:first-child').text(data.temperature);
            $('div.chuhe-humidity > div.chuhe-th-value > span:first-child').text(data.humidity);
            return;
        }
        else if (type === '04')
        {
            $(`div.chuhe-value > div.chuhe-value-item.strain > span`).text(data[v].toFixed(2));
        }
        const $card = $(`div#${name}-card.chuhe-card #${name}-card-current-number`);
        $card.text(data[v].toFixed(2));
    })

    RequestUtil.startMonitor(sensor.id, (data) => {
        refreshRealValue(sensor, data);
    });
}

function updateSensorNavigation(item)
{
    const type = item.meta;
    const name = Meta.getSensorMetaName(type);
    if (type !== '09')
    {
        $(`aside#left-sidebar-nav li#${name}-link > a`).attr('href', `/monitor/${name}/index.html#${item.id}`);
    }
}

function selectSensorItem(item, remote) {
    const type = item.meta;
    const name = Meta.getSensorMetaName(type);
    const $selectedSensorItem = $(`div#${name}-card  li.chuhe-sensor-item-selected`);
    const $sensorItem = $(`div#${name}-card  li#${item.id}`);
    const $chardTitle = $(`div#${name}-card a#${name}-card-title`);
    const $chardMonitorLink = $(`div#${name}-card div.chuhe-card-name > a.chuhe-monitor-link`);

    if (type !== '09')
    {
        $chardMonitorLink.attr('href', `javascript:window.open('/monitor/${name}/index.html#${item.id}')`);
    }
    else {
        $chardMonitorLink.attr('href', `javascript:window.open('/analytics/trafficmonitor/index.html#${item.id}')`);
    }
    $chardTitle.html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    $sensorItem.addClass("chuhe-sensor-item-selected");
    $selectedSensorItem.removeClass("chuhe-sensor-item-selected");

    updateSensorNavigation(item);

    if (selectedSensors[type])
    {
        RequestUtil.stopMonitor(selectedSensors[type]);
    }

    selectedSensors[type] = item.id;
    let sensorIds = Object.values(selectedSensors);
    bridgeScene.bridge.showSensors(sensorIds);

    if (remote) {
        fetchSensorData(item);
    }
}


RequestUtil.fetchSensors().then((data) => {
    for(let type in data) {
        initSensorlist(type, data[type]);
    }
});

////////////////// switch //////////////////////////////
$(".content a#chuhe-switch-button").on('click', e => {
    var $button = $(e.currentTarget);
    var $label = $button.children('i');
    var $map = $(".content #map");
    var $detail = $(".content #detail");

    $label.toggleClass('mdi-action-info');
    $label.toggleClass('mdi-navigation-cancel');
    $map.slideToggle();
    $detail.slideToggle();
});
