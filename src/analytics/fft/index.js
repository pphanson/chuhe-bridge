require('./style.less');

const {linechartTime, seriesTime} = require('./timelinechart');
const {linechartFft, seriesFft} = require('./fftlinechart');
const bridgeScene = require('./bridge');
const requestUtil = require('../../monitor/common/remote');

jQuery.datetimepicker.setLocale('zh');
jQuery(function() {
    jQuery('#beginTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                maxDate:jQuery('#endTime').val() ? jQuery('#endTime').val() : false,
            });
        },
        timepicker: true,
        theme: 'dark'
    });
    jQuery('#endTime').datetimepicker({
        format: 'Y-m-d H:i',
        onShow: function (ct) {
            this.setOptions({
                minDate:jQuery('#beginTime').val() ? jQuery('#beginTime').val() : false,
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
        "h+": this.getHours() % 24 === 1 ? 0 : this.getHours() % 24, // 小时
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
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay()+""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
 *生成初始时间
 */
let from = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7).pattern("yyyy-MM-dd hh:mm")
let to = new Date().pattern("yyyy-MM-dd hh:mm");
$("input#beginTime").val(from);
$("input#endTime").val(to);

let type = '06';
let sensorIds = [];
requestUtil.fetchSensors(type).then((data) => {
    initSensorlist(data);
});

function initSensorlist(data) {
    var $ul = $('ul#vibration-dropdown');
    data.forEach((item, index) => {
        let $li = $(`<li id=${item.id}><a href='#'><span>${item.name}</span></a></li>`);
        $li.data(item);
        $ul.append($li);
        if (index === 0) {
            selectSensorItem(item);
        }
    });
    $ul.on('click', 'li', function (e) {
        selectSensorItem($(e.currentTarget).data());
    });
}

function selectSensorItem(item) {
    var $selectedSensorItem = $('ul#vibration-dropdown li.chuhe-sensor-item-selected');
    var $sensorItem = $(`ul#vibration-dropdown  li#${item.id}`);
    var $chardTitle = $("a#vibration-title");

    $chardTitle.html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    $sensorItem.addClass("chuhe-sensor-item-selected");
    $selectedSensorItem.removeClass("chuhe-sensor-item-selected");

}

$('input#clickid').on('click', e => {

    let from = new Date(document.getElementById("beginTime").value);
    let to = new Date(document.getElementById("endTime").value);
    let id = $("ul#vibration-dropdown li.chuhe-sensor-item-selected").attr("id");
    sensorIds = id;
    bridgeScene.bridge.showSensors(sensorIds);

    requestUtil.getAnalytics(id, from.toJSON(), to.toJSON()).then((data) => {
        seriesTime.data = data.timeArray;
        linechartTime.setData([seriesTime]);
        linechartTime.setupGrid();
        linechartTime.draw();

        seriesFft.data = data.sensorFft;
        linechartFft.setData([seriesFft]);
        linechartFft.setupGrid();
        linechartFft.draw();
    });
});
