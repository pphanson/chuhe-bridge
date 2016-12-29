require('./style.less');

const requestUtil = require('../../monitor/common/remote');

jQuery('#beginTime').datetimepicker();
jQuery('#endTime').datetimepicker();

/**
 *实时获取当前数据
 */
let from = new Date(new Date().getFullYear(),new Date().getMonth() - 2, new Date().getDate())
let to = new Date();
requestUtil.getAlarmDate(from.toJSON(), to.toJSON()).then((data) => {
    addTableNumber(data);
});

function addTableNumber(data) {
    let tr = "";
    $.each(data, function (index) {
        tr += '<tr><td>' + new Date(data[index].timestamp).pattern("yyyy-MM-dd hh:mm:ss") + '</td><td>' +
            data[index].alarm_type + '</td><td>' + data[index].alarm_lever + '</td><td>' + data[index].sensor_name +
            '</td><td>' + data[index].alarm_content + '</td><td>' +data[index].alarm_value + '</td></tr>';
    });
    $('tbody#tbody').html(tr);
    $('tr:even').css('background', '#192e46');
    $('tr:odd').css('background', '#1f3653');
}

/**
 * 格式化时间
 */
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}