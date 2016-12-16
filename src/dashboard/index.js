require('./style.less');

const series = require('../monitor/common/series');
const map = require('./map');
const bridgeScene =require('./bridge');
const LineChart = require('./lineChart.js');
const RequestUtil = require('../monitor/common/remote');

const now = new Date();
const historyFrom = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - 1
);
const historyTo = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - 1,
  23,
  59,
  59
);

let sensorMeta;

RequestUtil.fetchSensorsMeta().then(data => {
    sensorMeta = data;
})




const timeInterval = {
  '04': 60 * 1000,
  '01': 60 * 1000,
  '03': 60 * 1000,
  '02': 60 * 1000,
  '06': 5 * 1000,
  '05': 60 * 1000,
  '08': 60 * 60 * 1000
};

const timeRange = {
  '04': [new Date(now.getTime()), new Date(now.getTime() + 59 * 60 * 1000)],
  '01': [new Date(now.getTime()), new Date(now.getTime() + 59 * 60 * 1000)],
  '03': [new Date(now.getTime()), new Date(now.getTime() + 59 * 60 * 1000)],
  '02': [new Date(now.getTime()), new Date(now.getTime() + 59 * 60 * 1000)],
  '06': [new Date(now.getTime()), new Date(now.getTime() + 5 * 60 * 1000)],
  '05': [new Date(now.getTime()), new Date(now.getTime() + 59 * 60 * 1000)],
  '08': [new Date(now.getTime()), new Date(now.getTime() + 60 * 60 * 1000 * 23)],
};

const collection = {
  '04': series({'from': timeRange['04'][0], 'to': timeRange['04'][1], 'values': ['strain'], 'interval': 60 * 1000}),
  '01': series({'from': timeRange['01'][0], 'to': timeRange['01'][1], 'values': ['verticality'], 'interval':60 * 1000}),
  '03': series({'from': timeRange['03'][0], 'to': timeRange['03'][1], 'values': ['displacement'], 'interval': 60 * 1000}),
  '02': series({'from': timeRange['02'][0], 'to': timeRange['02'][1], 'values': ['deflection'], 'interval': 60 * 1000}),
  '06': series({'from': timeRange['06'][0], 'to': timeRange['06'][1], 'values': ['x', 'y', 'z'], 'interval': 5 * 1000}),
  '05': series({'from': timeRange['05'][0], 'to': timeRange['05'][1], 'values': ['baseband'], 'interval': 60 * 1000}),
  '08': series({'from': timeRange['08'][0], 'to': timeRange['08'][1], 'values': ['corrosion'], 'interval': 1000 * 60 * 60})
};



const lineCharts = {
  '04': LineChart('strain', collection['04']),
  '03': LineChart('displacement', collection['03']),
  '01': LineChart('verticality', collection['01']),
  '05': LineChart('cableforce', collection['05']),
  '02': LineChart('deflection', collection['02']),
  '09': LineChart('trafficload'),
  '08': LineChart('corrosion', collection['08']),
  '06': LineChart('vibration', collection['06'])
};


bridgeScene.on("load", function(e) {
    let sensorIds = Object.values(selectedSensors);
    this.bridge.showSensors(sensorIds);
});

///////////////// sensor card ///////////////////////////
let selectedSensors = {};

function initSensorlist(type, data) {
    var $ul = $(`ul#${sensorMeta[type].name}-card-dropdown`);
    data.forEach((item, index) => {
        let $li = $(`<li id=${item.id}><a href='#'><span>${item.name}</span></a></li>`);
        $li.data(item);
        $ul.append($li);
        if (index === 0) {
            selectSensorItem(type, item, true);
        }
    });
    $ul.on('click', 'li', function(e) {
        selectSensorItem(type, $(e.currentTarget).data(), true)
    })
}

function getTimestamp(time, type)
{
    const from = timeRange[type][0];
    const interval = timeInterval[type];
    const index = Math.floor((time - from) / interval);
    return new Date(from.getTime() + index * interval);
}

function refreshRealValue(type, v, data)
{
    if (type === '07')
    {
        return;
    }
    let timestamp = getTimestamp(new Date(data.lastUpdatedTime), type);
    const lineChart = lineCharts[type];
    const col = collection[type];


    let $card = $(`div#${sensorMeta[type].name}-card.chuhe-card #${sensorMeta[type].name}-card-current-number`);
    $card.text(data.value[v].toFixed(2));

    if (timestamp < timeRange[type][1]) {
        let timeslot = Math.floor((timestamp - timeRange[type][0]) / timeInterval[type]);
        if (col[v].data[timeslot][1] === null) {
            col[v].data[timeslot][1] = data.value[v];
        }
    } else {
        col[v].data.splice(0, 1);
        col[v].data.push([timestamp.getTime(), data.value[v]]);
        timeRange[type][1] = timestamp;
        timeRange[type][0] = new Date(col[v].data[0][0]);
    }

    lineChart.setData([col[v]]);
    lineChart.setupGrid();
    lineChart.draw();
}

function refreshHistoryValue(type, id, value, data)
{
    if (type === '07')
    {
        return;
    }
    var $card = $(`div#${sensorMeta[type].name}-card.chuhe-card #${sensorMeta[type].name}-card-history-number`);
    $card.html(data[id] && data[id][value]&& data[id][value].max ? data[id][value].max.toFixed(2) : '&ndash;');
}

function selectSensorItem(type, item, remote) {
    var $selectedSensorItem = $(`div#${sensorMeta[type].name}-card  li.chuhe-sensor-item-selected`);
    var $sensorItem = $(`div#${sensorMeta[type].name}-card  li#${item.id}`);
    var $chardTitle = $(`div#${sensorMeta[type].name}-card a#${type}-card-title`);
    var $chardMonitorLink = $(`div#${sensorMeta[type].name}-card div.chuhe-card-name > a.chuhe-monitor-link`);

    $chardMonitorLink.attr('href', `/monitor/${sensorMeta[type].name}/index.html#${item.id}`);
    $chardTitle.html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    $sensorItem.addClass("chuhe-sensor-item-selected");
    $selectedSensorItem.removeClass("chuhe-sensor-item-selected");

    if (selectedSensors[type])
    {
        RequestUtil.stopMonitor(selectedSensors[type]);
    }

    selectedSensors[type] = item.id;
    let sensorIds = Object.values(selectedSensors);
    bridgeScene.bridge.showSensors(sensorIds);

    if (remote) {
        RequestUtil.fetchSensorStats(
          item.id,
          historyFrom.toJSON(),
          historyTo.toJSON()
        ).then(data => {

            refreshHistoryValue(type, item.id, type === '06' ? 'x': sensorMeta[type].name, data);
        });

        RequestUtil.startMonitor(item.id, data => {
            let v;
            if (type === '06')
            {
               v = 'x';
            }
            else {
               v = sensorMeta[type].name;
            }
            refreshRealValue(type, v, data);
        });
    }
}


RequestUtil.fetchSensors().then(data => {
  for (let type in data) {
      initSensorlist(type, data[type]);
  };
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
