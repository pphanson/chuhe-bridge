/**
 *日平均小时过桥车辆总重统计
 */
const downLeftChart = {
    color: '#7250b9',
};
let ticks = [
    [0, "1"], [1, "2"], [2, "3"], [3, "4"], [4, "5"], [5, "6"], [6, "7"], [7, "8"], [8, "9"], [9, "10"], [10, "11"], [11, "12"],
    [12, "13"], [13, "14"], [14, "15"], [15, "16"], [16, "17"], [17, "18"], [18, "19"], [19, "20"], [20, "21"], [21, "22"], [22, "23"], [23, "24"],
];
const downLeft = $(".chuhe-bar-chart3").plot([downLeftChart], {
    series: {
        bars: {
            show: true
        }
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
            color: '#545B82',
        },
    },
    yaxis: {
        show: true,
        zoomRange: false,
        panRange: false,
        font: {
            color: '#545B82',
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
    downLeft.resize();
    downLeft.setupGrid();
    downLeft.draw();
});

module.exports = {
    downleft: downLeft,
    downleftchart: downLeftChart,
};
