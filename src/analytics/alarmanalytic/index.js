require('./style.less');

const requestUtil = require('../../monitor/common/remote');

jQuery.datetimepicker.setLocale('zh');
jQuery(function() {
    jQuery('#beginTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                maxDate:jQuery('#endTime').val()?jQuery('#endTime').val():false
            });
        },
        timepicker: true,
        theme: 'dark'
    });
    jQuery('#endTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                minDate:jQuery('#beginTime').val() ? jQuery('#beginTime').val() : false
            });
        },
        timepicker: true,
        theme: 'dark'
    });
});

/**
 * 格式化时间
 */
Date.prototype.pattern = function(fmt) {
    let o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 小时
        "H+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    let week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 设置默认时间，从当前时间往前取一个月的时间
 */
let from = new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate() - 14).pattern("yyyy-MM-dd hh:mm:ss")
let to = new Date().pattern("yyyy-MM-dd hh:mm:ss");
$("input#beginTime").val(from);
$("input#endTime").val(to);

function getAlarm() {
    let begintime = new Date(document.getElementById("beginTime").value);
    let endtime = new Date(document.getElementById("endTime").value);

    requestUtil.getAlarmStatistics(begintime.toJSON(), endtime.toJSON()).then((data) => {
        let dataSet1 = [];
        let color1 = ['#2B6D52', '#24884C', '#40A98B', '#6BBEB6', '#5CE5BB']
        for (let i = 0; i < data.simpleSensor.length; i++) {
            dataSet1[i] = {
                label: data.simpleSensor[i]._id,
                data: data.simpleSensor[i].count,
                color: color1[i],
            };
        }

        let dataSet2 = [];
        let color2 = ['#654BB9', '#4654B5', '#6374DE', '#4D6DBA']
        for (let i = 0; i < data.sensorType.length; i++) {
            dataSet2[i] = {
                label: data.sensorType[i]._id,
                data: data.sensorType[i].count,
                color: color2[i]
            };
        }

        let dataSet3 = [];
        let color3 = ['#0DC1FE', '#32E5EA', '#6CDBD5', '#3BC1B6']
        for (let i = 0; i < data.sensorPosition.length; i++) {
            dataSet3[i] = {
                label: data.sensorPosition[i]._id,
                data: data.sensorPosition[i].count,
                color: color3[i]
            };
        }

        let options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.55,
                    label: {
                        show: true,
                        radius: 180,
                        formatter: function (label, series) {
                            return '<div style="border:1px solid grey;font-size:10pt;text-align:center;padding:5px;color:white;">' +
                                label + ' : ' +
                                Math.round(series.percent) +
                                '%</div>';
                        },
                        background: {
                            opacity: 0.8,
                            color: '#000'
                        }
                    }
                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true
            }
        };

        $.plot($("#chuhe-sensorSingle"), dataSet1, options);
        $("#chuhe-sensorSingle").showMemo("#flot-memo");
        $.plot($("#chuhe-sensor-type"), dataSet2, options);
        $("#chuhe-sensor-type").showMemo("#flot-memo1");
        $.plot($("#chuhe-position"), dataSet3, options);
        $("#chuhe-position").showMemo("#flot-memo2");
    });
}

$.fn.showMemo = function (id) {
    $(this).bind("plothover", function (event, pos, item) {
        if (!item) { return; }
        console.log(item.series.data)
        let html = [];
        let percent = parseFloat(item.series.percent).toFixed(2);

        html.push("<div style=\"height:50px;display:flex;justify-content:center;border:1px solid grey;background-color:",
            item.series.color,
            "\">",
            "<span style=\"color:white;line-height:45px\">",
            item.series.label,
            " : ",
            item.series.data[0][1],
            " (", percent, "%)",
            "</span>",
            "</div>");
        $(id).html(html.join(''));
    });
}

getAlarm();
$("input#chuhe-alarmAnalytics-submit").on('click', e => {
    getAlarm();
});
