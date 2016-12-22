require('./style.less');

const {linechart, series} = require('./timelinechart');
const bridgeScene = require('./bridge');
const requestUtil = require('../../monitor/common/remote');
const Meta = require('../../monitor/common/meta');

requestUtil.fetchSensorsMeta().then((data) => {
    let s = [];
    for (let type in data) {
        if (type) {
            s.push({"type": type, "name": data[type].name});
        }
    }
    initTypeList(s, "x");
    initTypeList(s, "y");
});

function initTypeList(data, obj) {
    let sensorType = $(`#sensorType-${obj}-dropdown`);
    data.forEach((item, index) => {
        let li = $(`<li id=${item.type}><a href='#'><span>${item.name}</span></a></li>`);
        li.data(item);
        sensorType.append(li);
        if (index === 0){
            setSensorType(item, obj);
        }
    });
    sensorType.on("click", "li", {msg: obj}, function (e) {
        setSensorType($(e.currentTarget).data(), e.data.msg);
    })
}

function setSensorType(item, msg) {
    $(`#sensor-${msg}-type`).html(item.name);
    let s = $(`ul#sensorType-${msg}-dropdown li#${item.type}`);
    $(`ul#sensorType-${msg}-dropdown li`).removeClass("sensorTypeSelected");
    s.addClass("sensorTypeSelected");
    setSensor(item.type, msg);
}

function setSensor(type, msg) {
    let sensora = $(`#sensors-${msg}-dropdown`);
    sensora.empty();
    requestUtil.fetchSensors(type).then((data) => {
        data.forEach((item, index) => {
            let li = $(`<li id="${item.id}"><a href='#'><span>${item.name}</span></a></li>`);
            li.data(item);
            sensora.append(li);
        })
        sensora.on("click", "li", {msg: msg}, function (e) {
            $(`ul#sensors-${e.data.msg}-dropdown li`).removeClass("sensorSelected");
            $(this).addClass("sensorSelected");
            $(`#sensors-${e.data.msg}-select`).html($(e.currentTarget).data().name);
        });
    });
}

$("#buttona").on('click', e => {
    let from = new Date(document.getElementById("beginTime").value);
    let to = new Date(document.getElementById("endTime").value);
    let x = $("#sensors-x-dropdown li.sensorSelected").attr("id");
    let y = $("#sensors-y-dropdown li.sensorSelected").attr("id");

    requestUtil.getCorrelation(x, y, from.toJSON(), to.toJSON()).then(data => {
        series.data = data.result;
        linechart.setData([series]);
        linechart.setupGrid();
        linechart.draw();
    });
});
