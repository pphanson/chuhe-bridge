require('./style.less');

const {linechartTime, seriesTime} = require('./timelinechart');
const bridgeScene = require('./bridge');
const requestUtil = require('../../monitor/common/remote');
const Meta = require('../../monitor/common/meta');

/**
 * X轴选择传感器类型
 */

requestUtil.fetchSensorsMeta().then(data => {
    let s = [];
    for (let type in data) {
        if (type) {
            s.push({"type":type, "name": data[type].name});
        }
    }
    initSensorTypelistY(s);
    initSensorTypelistX(s);

});

function initSensorTypelistX(data) {
    let $ul = $(`ul#sensorType-x-dropdown`);
    data.forEach((item, index) => {
        let $li = $(`<li id=${item.type}><a href='#'><span>${item.name}</span></a></li>`);
        $li.data(item);
        $ul.append($li);
        if (index === 0) {
            selectSensorTypeX(item, true);
        }
    });
    $ul.on('click', 'li', function(e) {
        selectSensorTypeX($(e.currentTarget).data(), true);
    });
}

function selectSensorTypeX(item) {
    selectSensorsX(item.type);
    var $selectedSensorTypeX = $("ul#sensorType-x-dropdown li.chuhe-sensor-item-selected");
    var $sensorTypeX = $(`ul#sensorType-x-dropdown li#${item.type}`);
    var $typeNameX = $("a#sensor-x-type");

    $typeNameX.html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    $sensorTypeX.addClass("chuhe-sensor-item-selected");
    $selectedSensorTypeX.removeClass("chuhe-sensor-item-selected");
}

/**
 * X轴根据选中的传感器类型再选择具体传感器
 */
function selectSensorsX(type) {
    $('ul#sensors-x-dropdown li').remove();
    requestUtil.fetchSensors(type).then(data => {
        initSensorlistX(data);
    });
}

function initSensorlistX(data) {
    var $ul = $('ul#sensors-x-dropdown');
    data.forEach((item, index) => {
        let $li = $(`<li id=${item.id}><a href='#'><span>${item.name}</span></a></li>`);
        $li.data(item);
        $ul.append($li);
        if (index === 0) {
            selectSensorItemX(item, true);
        }
    });
    $ul.on('click', 'li', function (e) {
        selectSensorItemX($(e.currentTarget).data(), true);
    });
}

function selectSensorItemX(item) {
    var $selectedSensorItemX = $('ul#sensors-x-dropdown li.chuhe-sensor-x-item-selected');
    var $sensorItemX = $(`ul#sensors-x-dropdown li#${item.id}`);
    var $chardTitleX = $("a#sensors-x-select");

    $chardTitleX.html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    $sensorItemX.addClass("chuhe-sensor-x-item-selected");
    $selectedSensorItemX.removeClass("chuhe-sensor-x-item-selected");
}

/**
 * Y轴选择传感器类型
 */

function initSensorTypelistY(data) {
    let $ul = $(`ul#sensorType-y-dropdown`);
    data.forEach((item, index) => {
        let $li = $(`<li id=${item.type}><a href='#'><span>${item.name}</span></a></li>`);
        $li.data(item);
        $ul.append($li);
        if (index === 0) {
            selectSensorTypeY(item, true);
        }
    });
    $ul.on('click', 'li', function(e) {
        selectSensorTypeY($(e.currentTarget).data(), true);
    });
}

function selectSensorTypeY(item) {
    selectSensorsY(item.type);
    var $selectedSensorTypeY = $("ul#sensorType-y-dropdown li.chuhe-sensor-item-selected");
    var $sensorTypeY = $(`ul#sensorType-y-dropdown li#${item.type}`);
    var $typeNameY = $("a#sensor-y-type");

    $typeNameY.html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    $selectedSensorTypeY.removeClass("chuhe-sensor-item-selected");
    $sensorTypeY.addClass("chuhe-sensor-item-selected");
}

/**
 * Y轴根据选中的传感器类型再选择具体传感器
 */
function selectSensorsY(type) {
    $('ul#sensors-y-dropdown li').remove();
    requestUtil.fetchSensors(type).then(data => {
        initSensorlistY(data);
    });
}

function initSensorlistY(data) {
    var $ul = $('ul#sensors-y-dropdown');
    data.forEach((item, index) => {
        let $li = $(`<li id=${item.id}><a href='#'><span>${item.name}</span></a></li>`);
        $li.data(item);
        $ul.append($li);
        if (index === 0) {
            selectSensorItemY(item, true);
        }
    });
    $ul.on('click', 'li', function (e) {
        selectSensorItemY($(e.currentTarget).data(), true);
    });
}

function selectSensorItemY(item) {
    let s = item;
    var $selectedSensorItemY = $('ul#sensors-y-dropdown li.chuhe-sensor-y-a-item-selected');
    var $sensorItemY = $(`ul#sensors-y-dropdown li#${item.id}`);
    var $chardTitleY = $("a#sensors-y-select");

    $chardTitleY.html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    $selectedSensorItemY.removeClass("chuhe-sensor-y-a-item-selected");
    $sensorItemY.addClass("chuhe-sensor-y-a-item-selected");

}


$('input#chuhe-correlation-submit').on('click', e => {

    let from = new Date(document.getElementById("beginTime").value);
    let to = new Date(document.getElementById("endTime").value);
    let y = $("ul#sensors-y-dropdown li.chuhe-sensor-y-a-item-selected").attr("id");
    let x = $("ul#sensors-x-dropdown li.chuhe-sensor-x-item-selected").attr("id");
    alert(y);
    alert(x);

});



