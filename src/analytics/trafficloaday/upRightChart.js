/**
 *傅里叶分析上方的时间序列
 */
const upRightChart = {
    color: 'white',
    fill: true,
    fillColor: {colors: ['rgb(41, 176, 146)', 'rgb(64, 112, 138)']}
};

const upRight = $(".chuhe-bar-chart2").plot([upRightChart], {
    series: {
        bars: {
            show: true
        }
    },
    bars: {
        align: "center",
        barWidth: 0.5
    },
    zoom: {
        interactive: true
    },
    pan: {
        interactive: false
    },
    xaxis: {
        show: true,
        zoomRange: false,
        panRange: false,
        font: {
            color: 'white'
        }
    },
    yaxis: {
        show: true,
        zoomRange: false,
        panRange: false,
        font: {
            color: 'white'
        }
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


