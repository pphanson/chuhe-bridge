require('./style.less');

const requestUtil = require('../../monitor/common/remote');

getTrafficData();
function getTrafficData() {
    let from = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    let to = new Date();

    requestUtil.getAlarmStatistics(from.toJSON(), to.toJSON()).then((data) =>{
        let dataSet = [
        {label: "超载", data: 145, color: "#3BFFD9" },
        { label: "未超载", data: 250, color: "#5D7291" },
        ];

        var options = {
            series: {
                pie: {
                    show: true,
                }
            },
            legend: {
                show: false
            },
            grid: {
                hoverable: true
            }
        };

        $.plot($("#chuhe-pie-chart"), dataSet, options);
    });
};

/**
 *  初始化监测实时数据（上方）
 */
initTr();
function initTr(count = 8)
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
        }
        let $row = $(`<tr data-row-index=${i}><td data-field="time">${axesname[i]}</td><td data-field="weight"><span class="chuhe-monitor-${i}">0</span>
                <span>kg</span></td><td data-field="chuhe-speed-${i}"><span class="chuhe-monitor-value${i}">0</span><span>km/h</span></td></tr>`);

        $tbody.append($row);
        $('tr:even').css('background', '#182D46');
        $('tr:odd').css('background', '#14263C');
    }
}

/**
 *  初始化所有信息的表结构（下方的）
 */
initRows(7);
function initRows(count = 7)
{
    const $tbody = $('.chuhe-traffic-down > table > tbody');

    for (let i = 0; i < count; i++)
    {
        let $row = $(`<tr data-row-index=${i}><td data-field="time">-</td><td data-field="licenseplate">-</td><td data-field="lane">-</td>
            <td data-field="overline">-</td><td data-field="weight">-</td><td data-field="axesnumber">-</td><td data-field="overweight">-</td>
            <td data-field="axesweight1">-</td><td data-field="axesweight2">-</td><td data-field="axesweight3">-</td><td data-field="axesweight4">-</td>
            <td data-field="axesweight5">-</td><td data-field="axesweight6">-</td><td data-field="axesweight7">-</td><td data-field="axesweight8">-</td></tr>`);

        $tbody.append($row);
        $('tr:even').css('background', '#103E6C');
        $('tr:odd').css('background', '#0E355C');
    }
}