/**
 *日平均单台车辆重量分类统计
 */
const downRightChart = {
    color: '#6386a1',
};
let ticks = [
    [0, "(0,10]"], [1, "(10,20]"], [2, "(20,30]"], [3, "(30,40]"], [4, "(40,50]"], [5, "(50,55]"], [6, "(55,60]"], [7, "(60,70]"], [8, "70+"],
];
const downRight = $(".chuhe-bar-chart4").plot([downRightChart], {
    series: {
        bars: {
            show: true,
        },
    },
    bars: {
        align: "center",
        barWidth: 0.5,
    },
    zoom: {
        interactive: true,
    },
    pan: {
        interactive: false,
    },
    xaxis: {
        show: true,
        zoomRange: false,
        panRange: false,
        ticks: ticks,
        font: {
            color: '#62727A',
        },
    },
    yaxis: {
        show: true,
        zoomRange: false,
        panRange: false,
        font: {
            color: '#62727A',
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
            top: 30,
            bottom: 5,
        },
        borderColor: {
            left: '#9b99ff',
            bottom: '#9b99ff',
        },
    },
}).data('plot');

$(window).on('resize', function() {
    downRight.resize();
    downRight.setupGrid();
    downRight.draw();
});

module.exports = {
    downright: downRight,
    downrightchart: downRightChart
}


