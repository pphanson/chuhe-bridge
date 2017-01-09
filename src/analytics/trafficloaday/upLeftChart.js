/**
 *傅里叶分析上方的时间序列
 */
const upLeftChart = {
    color: 'white',
    fill: true,
    fillColor: {colors: ['rgb(41, 176, 146)', 'rgb(64, 112, 138)']}
};

const upLeft = $(".chuhe-bar-chart1").plot([upLeftChart], {
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
    upLeft.resize();
    upLeft.setupGrid();
    upLeft.draw();
});

module.exports = {
    upleft: upLeft,
    upleftchart: upLeftChart
}


