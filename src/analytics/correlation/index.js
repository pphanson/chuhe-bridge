require('./style.less');

const {linechart, series1, series2} = require('./timelinechart');
const bridgeScene = require('./bridge');
const requestUtil = require('../../monitor/common/remote');
const Meta = require('../../monitor/common/meta');

jQuery.datetimepicker.setLocale('zh');
jQuery(function() {
    jQuery('#beginTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function ( ct ) {
            this.setOptions({
                maxDate:jQuery('#endTime').val()?jQuery('#endTime').val():false
            })
        },
        timepicker: true,
        theme:'dark'
    });
    jQuery('#endTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function ( ct ){
            this.setOptions({
                minDate:jQuery('#beginTime').val()?jQuery('#beginTime').val():false
            })
        },
        timepicker: true,
        theme:'dark'
    });
});

const names = {
    'displacement': '位移传感器',
    'verticality': '垂直度传感器',
    'cableforce': '索力传感器',
    'corrosion': '腐蚀传感器',
    'strain': '应变传感器',
    'trafficload': '交通荷载传感器',
    'deflection': '挠度传感器',
    'vibration': '振动传感器',
    'temperature and humidity': '温湿度传感器'
};

const units = {
    '01': '(mm)',
    '02': '(mm)',
    '03': '(°)',
    '04': '(MPa)',
    '05': '(kN)',
    '06': '(mm/s²)',
    '07': '(kN)',
    '08': '(mm/a)',
    '09': '(℃)'
}
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
        let li = $(`<li id=${item.type}><a href='#'><span>${names[item.name]}</span></a></li>`);
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
    $(`#sensor-${msg}-type`).html(names[item.name] + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    let s = $(`ul#sensorType-${msg}-dropdown li#${item.type}`);
    $(`ul#sensorType-${msg}-dropdown li`).removeClass("sensorTypeSelected");
    s.addClass("sensorTypeSelected");
    setSensor(item.type, msg);
    if(msg === 'x'){
        $("div.chuhe-correlationX-title span.chuhe-x-unit").html(units[item.type]);
    }else{
        $("div.chuhe-correlationY-title span.chuhe-y-unit").html(units[item.type]);
    }
}

function setSensor(type, msg) {
    let sensora = $(`#sensors-${msg}-dropdown`);
    sensora.empty();
    requestUtil.fetchSensors(type).then((data) => {
        data.forEach((item) => {
            let li = $(`<li id="${item.id}"><a href='#'><span>${item.name}</span></a></li>`);
            li.data(item);
            sensora.append(li);
        })
        sensora.on("click", "li", {msg: msg}, function (e) {
            $(`ul#sensors-${e.data.msg}-dropdown li`).removeClass("sensorSelected");
            $(this).addClass("sensorSelected");
            $(`#sensors-${e.data.msg}-select`).html($(e.currentTarget).data().name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
            if (msg === 'x') {
                $("div.chuhe-correlationX-title span.chuhe-x-name").html($(e.currentTarget).data().name);
            } else {
                $("div.chuhe-correlationY-title span.chuhe-y-name").html($(e.currentTarget).data().name);
            }
        });

    });
}

$("#buttona").on('click', e => {
    let from = new Date(document.getElementById("beginTime").value);
    let to = new Date(document.getElementById("endTime").value);
    let x = $("#sensors-x-dropdown li.sensorSelected").attr("id");
    let y = $("#sensors-y-dropdown li.sensorSelected").attr("id");
    let sensorIds = [x,y];
    bridgeScene.bridge.showSensors(sensorIds);
    requestUtil.getCorrelation(x, y, from.toJSON(), to.toJSON()).then(data => {
        series1.data = data.result;
        series2.data = [[data.min_X, data.startPointY], [data.max_X, data.endPointY]];
        linechart.setData([series1, series2]);
        linechart.setupGrid();
        linechart.draw();
    });
});
