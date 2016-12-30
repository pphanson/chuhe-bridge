const seriesTime = {
    //data: [[new Date("2016-11-01"), 2], [new Date("2016-11-02"), 3], [new Date("2016-11-03"), 4], [new Date("2016-11-04"), 5], [new Date("2016-11-05"), 6], [new Date("2016-11-06"), 7], [new Date("2016-11-01"),8]],
    color: 'green',
    fill: true,
    fillColor: {colors: ['rgb(41, 176, 146)', 'rgb(64, 112, 138)']}
};

const lineChart = $(".chuhe-history-down").plot(seriesTime, {
    series: {
        lines: {
            show: true
        },
        points: {
            show: false
        }
    },
    zoom: {
        interactive: false
    },
    pan: {
        interactive: false
    },

    xaxis: {
        // mode: "time",
        // timeformat: "%m/%d",
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
            top: 60,
            bottom: 5
        },
        borderColor: {
            left: '#9b99ff',
            bottom: '#9b99ff'
        }
    }
}).data('plot');

$(window).on('resize', function() {
    lineChart.resize();
    lineChart.setupGrid();
    lineChart.draw();
});

module.exports = {
    historylinechart: lineChart,
    series: seriesTime,
}

