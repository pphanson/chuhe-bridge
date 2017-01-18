/**
 *日车流量统计
 */
const upLeftChart = {
    color: 'white',
    lines: {
        show: true,
        fill: true,
        fillColor: {colors: ['#115165', '#118792']},
    }
};

const upLeft = $(".chuhe-bar-chart1").plot([upLeftChart], {
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
        mode: 'time',
        timeformat: "%m/%d",
        font: {
            color: '#507A7F',
        },
    },
    yaxis: {
        show: true,
        zoomRange: false,
        panRange: false,
        font: {
            color: '#507A7F'
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
            bottom: '#9b99ff',
        },
        hoverable: true,
    },
}).data('plot');

$(window).on('resize', function() {
    upLeft.resize();
    upLeft.setupGrid();
    upLeft.draw();
});

module.exports = {
    upleft: upLeft,
    upleftchart: upLeftChart,
};


