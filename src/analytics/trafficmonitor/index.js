require('./style.less');

const requestUtil = require('../../monitor/common/remote');

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
 *  初始化监测实时数据（上方）
 */
initTr();
function initTr (count = 8)
{
    const $tbody = $('table.chuhe-monitor-table');

    for (let i = 0; i < count; i++)
    {
        const axesname = {
            '0': '一轴',
            '1': '二轴',
            '2': '三轴',
            '3': '四轴',
            '4': '五轴',
            '5': '六轴',
            '6': '七轴',
            '7': '八轴',
        };
        let $row = $(`<tr data-row-index=${i}><td data-field="time">${axesname[i]}</td><td data-field="chuhe-weight-${i}"><span class="chuhe-weight-value${i}">0</span>
                <span>kg</span></td><td data-field="chuhe-speed-${i}"><span class="chuhe-speed-value${i}">0</span><span>km/h</span></td></tr>`);

        $tbody.append($row);
        $('tr:even').css('background', '#182D46');
        $('tr:odd').css('background', '#14263C');
    }
}

/**
 *  初始化所有信息的表结构（下方的）
 */
initRows(7);
function initRows (count = 7)
{
    const $tbody = $('.chuhe-traffic-down > table > tbody');

    for (let i = 0; i < count; i++)
    {
        let $row = $(`<tr data-row-index=${i}><td data-field="lastUpdatedTime">-</td><td data-field="licenseplate">-</td><td data-field="lane">-</td>
            <td data-field="acrosstag">-</td><td data-field="weight">-</td><td data-field="axesnumber">-</td><td data-field="overweighttag">-</td>
            <td data-field="axesequivalentload1">-</td><td data-field="axesequivalentload2">-</td><td data-field="axesequivalentload3">-</td>
            <td data-field="axesequivalentload4">-</td><td data-field="axesequivalentload5">-</td><td data-field="axesequivalentload6">-</td>
            <td data-field="axesequivalentload7">-</td><td data-field="axesequivalentload8">-</td></tr>`);

        $tbody.append($row);
        $('tr:even').css('background', '#103E6C');
        $('tr:odd').css('background', '#0E355C');
    }
}

let id = '0901';
requestUtil.startMonitor(id, (data) => {
    updataTraffic(data);
});

function updataTraffic (data) {
    if (data.value.lane === 1) {
        let $tbody = $(".chuhe-one-load table.chuhe-monitor-table");
        tableFlotDate(data, $tbody);
    } else {
        let $tbody = $(".chuhe-two-load table.chuhe-monitor-table");
        tableFlotDate(data, $tbody);
    }
}

function tableFlotDate (data, $tbody) {
    let $trrows = $tbody.find("tr");
    $trrows.each(function (index) {
        $($trrows[index]).find(`td[data-field=chuhe-weight-${index}] span.chuhe-weight-value${index}`).text(data.value[`axesweight${index + 1}`]);
        $($trrows[index]).find(`td[data-field=chuhe-speed-${index}] span.chuhe-speed-value${index}`).text(data.value[`axesvelocity${index + 1}`]);
    });
}

function getTableData () {
    requestUtil.getTrafficLoad().then((data) => {
        let count = data.count;
        let overWeight = data.overWeightCount;
        let noWeight = count - overWeight;
        getTableDown(data.last);

        $(".chuhe-data-statistics > .chuhe-number").html(overWeight);
        $(".chuhe-data-statistics > .chuhe-totle").html(count);

        let dataSet = [
            {label: "超载", data: overWeight, color: "#3BFFD9" },
            { label: "未超载", data: noWeight, color: "#5D7291" },
        ];

        let options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.55,
                },
            },
            legend: {
                show: false,
            },
            grid: {
                hoverable: true,
            },
        };
        let percent = (overWeight / count * 100).toFixed(1);
        $.plot($("#chuhe-pie-chart"), dataSet, options);
        $(".today-value > .flot-value").html(percent);
    });

    function getTableDown (data) {
        const value = {
            '0': "否",
            '1': "是",
        };

        let $table = $(".chuhe-traffic-down > table >tbody");
        let $rows = $table.find("tr");
        let currentTime = [new Date(new Date().getTime()-5000), new Date(new Date().getTime()-10000),new Date(new Date().getTime()-15000),
            new Date(new Date().getTime()-20000), new Date(new Date().getTime()-25000), new Date(new Date().getTime()-30000),
            new Date(new Date().getTime()-35000)]
        $rows.each(function (index) {
            $($rows[index]).find(`td[data-field=lastUpdatedTime]`).text(currentTime[index].pattern("hh:mm:ss"));
            $($rows[index]).find(`td[data-field=licenseplate]`).text(data[index].licenseplate);
            $($rows[index]).find(`td[data-field=lane]`).text(data[index].lane);
            $($rows[index]).find(`td[data-field=acrosstag]`).text(value[data[index].acrosstag]);
            $($rows[index]).find(`td[data-field=weight]`).text(data[index].weight);
            $($rows[index]).find(`td[data-field=axesnumber]`).text(data[index].axesnumber);
            $($rows[index]).find(`td[data-field=overweighttag]`).text(value[data[index].overweighttag]);
            $($rows[index]).find(`td[data-field=axesequivalentload1]`).text(data[index].axesequivalentload1);
            $($rows[index]).find(`td[data-field=axesequivalentload2]`).text(data[index].axesequivalentload2);
            $($rows[index]).find(`td[data-field=axesequivalentload3]`).text(data[index].axesequivalentload3);
            $($rows[index]).find(`td[data-field=axesequivalentload4]`).text(data[index].axesequivalentload4);
            $($rows[index]).find(`td[data-field=axesequivalentload5]`).text(data[index].axesequivalentload5);
            $($rows[index]).find(`td[data-field=axesequivalentload6]`).text(data[index].axesequivalentload6);
            $($rows[index]).find(`td[data-field=axesequivalentload7]`).text(data[index].axesequivalentload7);
            $($rows[index]).find(`td[data-field=axesequivalentload8]`).text(data[index].axesequivalentload8);
        });

    }
}
getTableData();
setInterval(getTableData, 1800000);
