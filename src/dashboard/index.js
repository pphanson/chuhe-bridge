require('./style.less');

const series = require('../monitor/common/series');

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

const timeInterval = {
  'strain': 60 * 1000,
  'displacement': 60 * 1000,
  'verticality': 60 * 1000,
  'deflection': 60 * 1000,
  'vibration': 5 * 1000,
  'cableforce': 60 * 1000,
  'corrosion': 60 * 60 * 1000
};

const timeRange = {
  'strain': [new Date(now.getTime()), new Date(now.getTime() + 59 * 60 * 1000)],
  'displacement': [new Date(now.getTime()), new Date(now.getTime() + 59 * 60 * 1000)],
  'verticality': [new Date(now.getTime()), new Date(now.getTime() + 59 * 60 * 1000)],
  'deflection': [new Date(now.getTime()), new Date(now.getTime() + 59 * 60 * 1000)],
  'vibration': [new Date(now.getTime()), new Date(now.getTime() + 5 * 60 * 1000)],
  'cableforce': [new Date(now.getTime()), new Date(now.getTime() + 59 * 60 * 1000)],
  'corrosion': [new Date(now.getTime()), new Date(now.getTime() + 60 * 60 * 1000 * 23)],
};

const collection = {
  'strain': series({'from': timeRange['strain'][0], 'to': timeRange['strain'][1], 'values': ['strain'], 'interval': 60 * 1000}),
  'verticality': series({'from': timeRange['verticality'][0], 'to': timeRange['verticality'][1], 'values': ['verticality'], 'interval':60 * 1000}),
  'displacement': series({'from': timeRange['displacement'][0], 'to': timeRange['displacement'][1], 'values': ['displacement'], 'interval': 60 * 1000}),
  'deflection': series({'from': timeRange['deflection'][0], 'to': timeRange['deflection'][1], 'values': ['deflection'], 'interval': 60 * 1000}),
  'vibration': series({'from': timeRange['vibration'][0], 'to': timeRange['vibration'][1], 'values': ['x', 'y', 'z'], 'interval': 5 * 1000}),
  'cableforce': series({'from': timeRange['cableforce'][0], 'to': timeRange['cableforce'][1], 'values': ['baseband'], 'interval': 60 * 1000}),
  'corrosion': series({'from': timeRange['corrosion'][0], 'to': timeRange['corrosion'][1], 'values': ['corrosion'], 'interval': 1000 * 60 * 60})
};

const map = require('./map');
const bridgeScene =require('./bridge');
const LineChart = require('./lineChart.js');
const RequestUtil = require('../monitor/common/remote');

const lineCharts = {
  'strain': LineChart('strain', collection['strain']),
  'displacement': LineChart('displacement', collection['displacement']),
  'verticality': LineChart('verticality', collection['verticality']),
  'cableforce': LineChart('cableforce', collection['cableforce']),
  'deflection': LineChart('deflection', collection['deflection']),
  'trafficload': LineChart('trafficload'),
  'corrosion': LineChart('corrosion', collection['corrosion']),
  'vibration': LineChart('vibration', collection['vibration'])
};


bridgeScene.on("load", function(e) {
    let sensorIds = Object.values(selectedSensors);
    this.bridge.showSensors(sensorIds);
});

///////////////// sensor card ///////////////////////////
let selectedSensors = {};

function initSensorlist(type, data) {
    var $ul = $(`ul#${type}-card-dropdown`);
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
    if (type === 'temperature and humidity')
    {
        return;
    }
    let timestamp = getTimestamp(new Date(data.lastUpdatedTime), type);
    const lineChart = lineCharts[type];
    const col = collection[type];


    let $card = $(`div#${type}-card.chuhe-card #${type}-card-current-number`);
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
    if (type === 'temperature and humidity')
    {
        return;
    }
    var $card = $(`div#${type}-card.chuhe-card #${type}-card-history-number`);
    $card.html(data[id] && data[id][value]&& data[id][value].max ? data[id][value].max.toFixed(2) : '&ndash;');
}

function selectSensorItem(type, item, remote) {
    var $selectedSensorItem = $(`div#${type}-card  li.chuhe-sensor-item-selected`);
    var $sensorItem = $(`div#${type}-card  li#${item.id}`);
    var $chardTitle = $(`div#${type}-card a#${type}-card-title`);
    var $chardMonitorLink = $(`div#${type}-card div.chuhe-card-name > a.chuhe-monitor-link`);

    $chardMonitorLink.attr('href', `/monitor/${type}/index.html#${item.id}`);
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

            refreshHistoryValue(type, item.id, type === 'vibration' ? 'x': type, data);
        });

        RequestUtil.startMonitor(item.id, data => {
            let v;
            if (type === 'vibration')
            {
               v = 'x';
            }
            else if (type === 'cableforce'){
               v = 'baseband';
            }
            else {
               v = type;
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
