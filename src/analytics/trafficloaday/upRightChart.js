/**
 *日平均小时交通量
 */
const upRightChart = {
    color: '#1d91d3',
};

const upRight = $(".chuhe-bar-chart2").plot([upRightChart], {
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
        font: {
            color: '#8FACC1',
        },
        max: 25,
    },
    yaxis: {
        show: true,
        zoomRange: false,
        panRange: false,
        font: {
            color: '#8FACC1',
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
            bottom: '#9b99ff'
        }
    }
}).data('plot');

$(window).on('resize', function() {
    upRight.resize();
    upRight.setupGrid();
    upRight.draw();
});

module.exports = {
    upright: upRight,
    uprightchart: upRightChart
}


