require('./style.less');


const requestUtil = require('../monitor/common/remote');
const bridgeScene = require('./bridge');

jQuery.datetimepicker.setLocale('zh');
jQuery(function() {
    jQuery('#beginTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                maxDate:jQuery('#endTime').val() ? jQuery('#endTime').val() : false
            });
        },
        timepicker: true,
        theme: 'dark',
    });
    jQuery('#endTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                minDate:jQuery('#beginTime').val() ? jQuery('#beginTime').val() : false
            });
        },
        timepicker: true,
        theme: 'dark',
    });
});

/**
 * 选择传感器的类型及确定某个传感器
 */
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
    '08': '(mm/a)',
    '09': '(kg)',
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
    $(".chuhe-history-card > .chuhe-stats-card > .card-title > span.card-unit").html(units[item.type]);
    $(".chuhe-history-down > .chuhe-y-unit").html(units[item.type]);
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
                $(".chuhe-history-card > .chuhe-stats-card > .card-title > span.card-sensorname").html(item.name);
                $(".chuhe-history-down > .chuhe-y-name").html(item.name);
            }
        })
        sensora.on("click", "li", function (e) {
            $(`ul#chuhue-sensors-dropdown li`).removeClass("sensorSelected");
            $(this).addClass("sensorSelected");
            $(`#chuhe-sensors-select`).html($(e.currentTarget).data().name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
            $(".chuhe-history-card > .chuhe-stats-card > .card-title > span.card-sensorname").html($(e.currentTarget).data().name);
        });
        fetchSensorData();
    });
}

/**
 * 格式化时间
 */
Date.prototype.pattern = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours() % 24 === 1 ? 0 : this.getHours() % 24, // 小时
        "H+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds(), // 毫秒
    };
    let week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d",
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 设置默认时间，从当前时间往前取一个月的时间
 */
let from = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).pattern("yyyy-MM-dd hh:mm")
let to = new Date().pattern("yyyy-MM-dd hh:mm");
$("input#beginTime").val(from);
$("input#endTime").val(to);

// let historyStats;

function fetchSensorData()
{
    // 获取历史时间统计值
    let begintime = new Date(document.getElementById("beginTime").value);
    let endtime = new Date(document.getElementById("endTime").value);
    let id = $("ul#chuhue-sensors-dropdown li.sensorSelected").attr("id");
    let sensorIds = [id];
    bridgeScene.bridge.showSensors(sensorIds);
    requestUtil.fetchSensorStats(id, begintime.toJSON(), endtime.toJSON()).then((data) => {
       // historyStats = data[id];
        refreshSensorStats(id, data);
    });

    // 获取历史时间数据
    requestUtil.getHistoryDate(begintime.toJSON(), endtime.toJSON(), id).then((data) => {
        refreshLineChart(data);
    });
}

function refreshSensorStats(id, data) {
    const stats = data[id] ? data[id] : data;
    let value = Object.keys(stats)[0];
    let $card = $('div.chuhe-history-card > div.chuhe-stats-card');
    if (value !== null && value !== undefined && stats !== null && stats !== undefined && stats[value] !== null && stats[value] !== undefined) {
        $card.find("div.card-avg-item > div.card-item-value > span").text(stats[value].avg.toFixed(2));
        $card.find("div.card-max-item > div.card-item-value > span").text(stats[value].max.toFixed(2));
        $card.find("div.card-min-item > div.card-item-value > span").text(stats[value].min.toFixed(2));
    } else {
        $card.find("div.card-item > div.card-item-value > span").text("-");
    }
}

// function refreshLineChart(data) {
//
//     for (let i = 0;i < data.length;i++) {
//         data[i][0] = new Date(data[i][0] + 1000 * 60 * 60 * 8).getTime();
//     }
//
//     let chart7 = echarts.init(document.getElementById('ChinaChart_06'), 'macarons');
//     let option7 = {
//         // backgroundColor: "#ffffff ",
//         tooltip : {
//             trigger: 'axis',
//             axisPointer : {            // 坐标轴指示器，坐标轴触发有效
//                 type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
//             }
//         },
//         legend: {
//             data:['桥总数','每类桥数量'],
//             y : 'bottom'
//         },
//         grid: {
//             left: '3%',
//             right: '4%',
//             bottom: '10%',
//             containLabel: true
//         },
//         xAxis : [
//             {
//                 type : 'time',
//             }
//         ],
//         yAxis : [
//             {
//                 type : 'value',
//                 color : 'white',
//             }
//         ],
//         series : [
//             {
//                 name:'每类桥数量',
//                 type:'line',
//                 // barWidth : '50%',
//                 itemStyle: {
//                             normal: {
//                                 color: '#dd5d38'
//                             }
//                         },
//                 data:data,
//
//             }
//         ]
//     };
//     chart7.setOption(option7);
//     window.onresize = chart7.resize;
// }

function refreshLineChart(data) {
    for (let i = 0;i < data.length;i++) {
        data[i][0] = new Date(data[i][0] + 1000 * 60 * 60 * 8);
    }
    let dataSet = {
        data: data,
        color: "white",
    };
    let options = {
        series: {
            lines: {
                show: true,
                fill: true,
                fillColor: {colors: ['rgb(39, 41, 98)', 'rgb(58, 26, 153)']},
            },
            points: {
                show: false,
            },
        },
        zoom: {
            interactive: false,
        },
        pan: {
            interactive: false,
        },
        xaxis: {
            mode: 'time',
            show: true,
            timeformat: "%m/%d %H:%M",
            font: {
                color: 'rgb(157, 162, 243)',
            },
        },
        yaxis: {
            show: true,
            zoomRange: false,
            panRange: false,
            font: {
                color: 'rgb(157, 162, 243)',
            },
        },
        grid: {
            show: true,
            color: '#9b99ff',
            axisMargin: '15px',
            borderWidth: {
                left: 1,
                bottom: 1,
                top: 0,
                right: 0,
            },
            margin: {
                left: 15,
                right: 15,
                top: 20,
                bottom: 5,
            },
            borderColor: {
                left: '#9b99ff',
                bottom: '#9b99ff',
            },
        },
    };
    $("div.chuhe-history-down > .chuhe-history-linechart").plot([dataSet], options);
}

$('div.chuhe-select').on('click', 'input#chuhe-history-submit', (e) => {
    fetchSensorData();
});
