require('./style.less');

const requestUtil = require('../../monitor/common/remote');
const {linechart, series} = require('./lineChart');
const Meta = require('../../monitor/common/meta');
const bridgeScene = require('./bridge');

let from = localStorage.getItem("startData");
let to = localStorage.getItem("endData");
$('input#beginTime').val(from);
$('input#endTime').val(to);

const names= {
    'displacement' : '位移传感器',
    'verticality': '垂直度传感器',
    'cableforce': '索力传感器',
    'corrosion': '腐蚀传感器',
    'strain': '应变传感器',
    'trafficload': '交通荷载传感器',
    'deflection': '挠度传感器',
    'vibration': '振动传感器',
    'temperature and humidity': '温湿度传感器'
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

function initTypeList(data, obj) {
    let sensorType = $('#chuhe-sensorType-dropdown');
    data.forEach((item, index) => {
        let li = $(`<li id=${item.type}><a href='#'><span>${names[item.name]}</span></a></li>`);
        li.data(item);
        sensorType.append(li);
        if (index === 0){
            setSensorType(item, obj);
        }
    });
    sensorType.on("click", "li", function (e) {
        setSensorType($(e.currentTarget).data());
    })
}

function setSensorType(item) {
    $('#chuhe-detail-type').html(names[item.name] + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    let s = $(`ul#chuhe-sensorType-dropdown li#${item.type}`);
    $('ul#chuhe-sensorType-dropdown li').removeClass("sensorTypeSelected");
    s.addClass("sensorTypeSelected");
    setSensor(item.type);
}

function setSensor(type) {
    let sensora = $(`#chuhue-sensors-dropdown`);
    sensora.empty();
    requestUtil.fetchSensors(type).then((data) => {
        data.forEach((item, index) => {
            let li = $(`<li id="${item.id}"><a href='#'><span>${item.name}</span></a></li>`);
            li.data(item);
            sensora.append(li);
            if(index === 0){
                $(`ul#chuhue-sensors-dropdown li`).addClass("sensorSelected");
                $(`#chuhe-sensors-select`).html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
            }
        })
        sensora.on("click", "li", function (e) {
            $(`ul#chuhue-sensors-dropdown li`).removeClass("sensorSelected");
            $(this).addClass("sensorSelected");
            $(`#chuhe-sensors-select`).html($(e.currentTarget).data().name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
        });
        getSpecialData()
    });
}

function getSpecialData(){
    let id = $("ul#chuhue-sensors-dropdown li.sensorSelected").attr("id");
    requestUtil.getSpecialDetail(from, to, id).then((data)=>{
        for (let i=0;i<data.length;i++){
            data[i][0] = new Date(data[i][0]);
        }
        series.data=data;
        linechart.setData([series]);
        linechart.setupGrid();
        linechart.draw();
     })
}

$('div.chuhe-detail-select').on('click', 'input#clickId', e => {
    getSpecialData();
});

