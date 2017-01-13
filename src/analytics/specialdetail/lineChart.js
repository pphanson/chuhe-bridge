/**
 *事件详情的时间序列
 */
const series = {
    color: 'white',
    lines: {
        show: true,
        fill: true,
        fillColor: {colors: ['rgb(11, 104, 174)', 'rgb(35, 68, 122)']},
    },
};
const series1 = {
    color: 'rgb(126, 123, 108)',
    lines: {show: true, fill: false },
};
const series2 = {
    color: 'rgb(126, 123, 108)',
    lines: {show: true, fill: false },
};

const linechart = $(".chuhe-detail-down").plot([series, series1, series2], {
    zoom: {
        interactive: true,
    },
    pan: {
        interactive: false,
    },
    xaxis: {
        mode: 'time',
        show: true,
        timeformat: "%m/%d %H:%M",
        font: {
            color: '#9b99ff',
        },
    },
    yaxis: {
        show: true,
        zoomRange: false,
        panRange: false,
        font: {
            color: '#9b99ff',
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
            right: 0
        },
        margin: {
            left: 15,
            right: 15,
            top: 30,
            bottom: 5
        },
        borderColor: {
            left: '#9b99ff',
            bottom: '#9b99ff',
        },
    },
}).data('plot');

$(window).on('resize', function() {
    linechart.resize();
    linechart.setupGrid();
    linechart.draw();
});

module.exports = {
    linechart: linechart,
    series: series,
    series1: series1,
    series2: series2,
};


