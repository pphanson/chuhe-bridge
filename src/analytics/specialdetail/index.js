require('./style.less');

const requestUtil = require('../../monitor/common/remote');
const {linechart, series, series1, series2} = require('./lineChart');
const bridgeScene = require('./bridge');

let from = localStorage.getItem("startData");
let to = localStorage.getItem("endData");
$('input#beginTime').val(from);
$('input#endTime').val(to);

const names = {
    'displacement': '位移传感器',
    'verticality': '垂直度传感器',
    'cableforce': '索力传感器',
    'corrosion': '腐蚀传感器',
    'strain': '应变传感器',
    'trafficload': '交通荷载传感器',
    'deflection': '挠度传感器',
    'vibration': '振动传感器',
    'temperature and humidity': '温湿度传感器',
    'crack': '裂缝传感器',
};

const units = {
    '01': '(mm)',
    '02': '(mm)',
    '03': '(°)',
    '04': '(MPa)',
    '05': '(kN)',
    '06': '(mm/s²)',
    '07': '(℃)',
    '08': '(μm)',
    '09': '(kg)',
    '11': '(mm)',
};

requestUtil.fetchSensorsMeta().then((data) => {
    let s = [];
    for (let type in data) {
        if (type) {
            s.push({"type": type, "name": data[type].name});
        }
    }
    initTypeList(s);
});

function initTypeList (data, obj) {
    let sensorType = $('#chuhe-sensorType-dropdown');
    data.forEach((item, index) => {
        let li = $(`<li id=${item.type}><a href='#'><span>${names[item.name]}</span></a></li>`);
        li.data(item);
        sensorType.append(li);
        if (item.type === '01') {
            setSensorType(item, obj);
        }
    });
    sensorType.on("click", "li", function (e) {
        setSensorType($(e.currentTarget).data());
    });
}

function setSensorType (item) {
    $('#chuhe-detail-type').html(names[item.name] + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    let s = $(`ul#chuhe-sensorType-dropdown li#${item.type}`);
    $('ul#chuhe-sensorType-dropdown li').removeClass("sensorTypeSelected");
    s.addClass("sensorTypeSelected");
    setSensor(item.type);
    $(".chuhe-detail-down > .chuhe-y-unit").html(units[item.type]);
}

function setSensor (type) {
    let sensora = $(`#chuhue-sensors-dropdown`);
    sensora.empty();
    requestUtil.fetchSensors(type).then((data) => {
        data.forEach((item, index) => {
            let li = $(`<li id="${item.id}"><a href='#'><span>${item.name}</span></a></li>`);
            li.data(item);
            sensora.append(li);
            if (index === 0) {
                $(`ul#chuhue-sensors-dropdown li`).addClass("sensorSelected");
                $(`#chuhe-sensors-select`).html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
                $(".chuhe-detail-down > .chuhe-y-name").html(item.name);
            }
        });
        sensora.on("click", "li", function (e) {
            $(`ul#chuhue-sensors-dropdown li`).removeClass("sensorSelected");
            $(this).addClass("sensorSelected");
            $(`#chuhe-sensors-select`).html($(e.currentTarget).data().name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
            $(".chuhe-detail-down > .chuhe-y-name").html(item.name);
        });
        getSpecialData();
    });
}

function getSpecialData () {
    let id = $("ul#chuhue-sensors-dropdown li.sensorSelected").attr("id");
    let sensorIds = [id];
    bridgeScene.bridge.showSensors(sensorIds);
    requestUtil.getSpecialDetail(from, to, id).then((data) => {
        let alldata = [];
        for (let i = 0;i < data.length;i++) {
            data[i][0] = new Date(data[i][0] + 1000 * 60 * 60 * 8);
            if (data[i][1] !== null && data[i][1] !== undefined && data[i][1] !== '') {
                alldata.push(data[i][1]);
            }
        }
        let min = Math.min(Math.min(...alldata) * 0.8, 0);
        let max = Math.max(...alldata) * 1.2;
        series.data = data;
        series1.data = [[new Date(new Date(from).getTime() + 1000 * 60 * 60 * 8), min], [new Date(new Date(from).getTime() + 1000 * 60 * 60 * 8), max]];
        series2.data = [[new Date(new Date(to).getTime() + 1000 * 60 * 60 * 8), min], [new Date(new Date(to).getTime() + 1000 * 60 * 60 * 8), max]];
        linechart.setData([series, series1, series2]);
        linechart.setupGrid();
        linechart.draw();
    });
}

$('div.chuhe-detail-select').on('click', 'input#clickId', (e) => {
    getSpecialData();
});

