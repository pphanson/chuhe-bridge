require('./style.less');

const {piechart, series} = require('./timelinechart');

$("input#chuhe-alarmAnalytics-submit").on('click', e => {
    series.data = [{ label: "Series1", data: 10}, { label: "Series3", data: 90}, { label: "Series4", data: 70},
        { label: "Series5", data: 80}, { label: "Series6", data: 110}]

    piechart.setData([series]);
    piechart.drawLabels();
})
