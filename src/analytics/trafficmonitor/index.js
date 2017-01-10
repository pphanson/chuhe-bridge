require('./style.less');

const requestUtil = require('../../monitor/common/remote');

$('tr:even').css('background', '#182D46');
$('tr:odd').css('background', '#14263C');

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
