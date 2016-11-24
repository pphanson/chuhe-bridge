module.exports = function() {
    const options = {
        lines: {
            show: true
        },
        points: {
            show: false
        }
    };

    let lineChart = $.plot(".chuhe-linechart-content", [], {
        series: options,
        xaxis: {
            show: true,
            font: {
                color: 'white'
            }
        },
        yaxis: {
            show: true,
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
    });

    $(window).on('resize', function() {
        lineChart.resize();
        lineChart.setupGrid();
        lineChart.draw();
    });

    return lineChart;
};
