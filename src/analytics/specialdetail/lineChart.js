/**
 *事件详情的时间序列
 */
const series = {
    color: 'white',
    fill: true,
    fillColor: {colors: ['rgb(41, 176, 146)', 'rgb(64, 112, 138)']}
};

const linechart = $(".chuhe-detail-down").plot([series], {
    series: {
        lines: {
            show: true
        },
        points: {
            show: false
        }
    },
    zoom: {
        interactive: true
    },
    pan: {
        interactive: false
    },
    xaxis: {
        mode: 'time',
        show: true,
        timeformat: "%m/%d %H:%M",
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
    linechart.resize();
    linechart.setupGrid();
    linechart.draw();
});

module.exports = {
    linechart: linechart,
    series: series
}


