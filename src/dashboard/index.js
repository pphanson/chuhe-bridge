require('./style.less');

const map = require('./map');
const bridgeScene =require('./bridge');
const lineChart = require('./lineChart.js');
const RequestUtil = require('../monitor/common/remote');


const strainLineChart = lineChart('strain');
const displacementLineChart = lineChart('displacement');
const verticalityLineChart = lineChart('verticality');
const vibrationLineChart = lineChart('vibration');
const cableforceLineChart = lineChart('cableforce');
const deflectionLineChart = lineChart('deflection');
const trafficloadLineChart = lineChart('trafficload');
const corrosionLineChart = lineChart('corrosion');
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

function refreshRealValue(type, value, data)
{
    if (type === 'temperature and humidity')
    {
        return;
    }
    var $card = $(`div#${type}-card.chuhe-card #${type}-card-current-number`);
    $card.text(data.value[value].toFixed(2));
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
            refreshRealValue(type, type === 'vibration' ? 'x': type, data);
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
