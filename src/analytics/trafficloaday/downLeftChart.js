/**
 *傅里叶分析上方的时间序列
 */
const downLeftChart = {
    color: 'white',
    fill: true,
    fillColor: {colors: ['rgb(41, 176, 146)', 'rgb(64, 112, 138)']}
};

const downLeft = $(".chuhe-bar-chart3").plot([downLeftChart], {
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
    downLeft.resize();
    downLeft.setupGrid();
    downLeft.draw();
});

module.exports = {
    downleft: downLeft,
    downleftchart: downLeftChart
}


