require('./style.less');

const requestUtil = require('../../monitor/common/remote');

jQuery('#beginTime').datetimepicker();
jQuery('#endTime').datetimepicker();

$("input#chuhe-alarmAnalytics-submit").on('click', e => {
    let from = new Date(document.getElementById("beginTime").value);
    let to = new Date(document.getElementById("endTime").value);

    requestUtil.getAlarmStatistics(from.toJSON(), to.toJSON()).then(data => {
        let dataSet1=[];
        let color1 = ['#2B6D52', '#24884C', '#40A98B', '#6BBEB6', '#5CE5BB']
        for (let i = 0; i < data.simpleSensor.length; i++) {
            dataSet1[i] = {
                label: data.simpleSensor[i].sensor_name,
                data: data.simpleSensor[i].count,
                color: color1[i],
            }
        }

        let dataSet2=[];
        let color2 = ['#654BB9', '#4654B5', '#6374DE', '#4D6DBA']
        for (let i = 0; i < data.sensorType.length; i++) {
            dataSet2[i] = {
                label: data.sensorType[i].sensor_type_name,
                data: data.sensorType[i].count,
                color: color2[i]
            }
        }

        let dataSet3=[];
        let color3 = ['#0DC1FE', '#32E5EA', '#6CDBD5', '#3BC1B6']
        for (let i = 0; i < data.sensorPosition.length; i++) {
            dataSet3[i] = {
                label: data.sensorPosition[i].alarm_position,
                data: data.sensorPosition[i].count,
                color: color3[i]
            }
        }

        var options = {
            series: {
                pie: {
                    show: true,
                    innerRadius: 0.4,
                    sensor_name: {
                        show: true,
                        radius: 180,
                        formatter: function (label, series) {
                            return '<div style="border:1px solid grey;font-size:8pt;text-align:center;padding:5px;color:white;">' +
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

        $(document).ready(function () {
            $.plot($("#chuhe-sensorSingle"), dataSet1, options);
            $.plot($("#chuhe-sensor-type"), dataSet2, options);
            $.plot($("#chuhe-position"), dataSet3, options);
        });
    })
})