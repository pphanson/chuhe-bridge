const series1 = {
    color: 'rgb(26, 188, 167)',
    points: {show: true, fill: true },
};

const series2 = {
    color: 'rgb(26, 188, 167)',
    lines: {show: true, fill: false },
};

const lineChart = $(".chuhe-correlationLineChart-contant").plot([series1, series2], {
    zoom: {
        interactive: false,
    },
    pan: {
        interactive: false,
    },

    xaxis: {
        show: true,
        zoomRange: false,
        panRange: false,
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
    }
}).data('plot');

$(window).on('resize', function() {
    lineChart.resize();
    lineChart.setupGrid();
    lineChart.draw();
});

module.exports = {
  linechart: lineChart,
  series1: series1,
  series2: series2,
};
