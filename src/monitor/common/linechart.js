module.exports = function({from, to, interval, collection}) {
    const options = {
        lines: {
            show: true,
            lineWidth: 1
        },
        points: {
            show: false
        }
    };

    let lineChart = $(".chuhe-linechart-content").plot(collection, {
        series: options,
        zoom: {
            interactive: true
        },
        pan: {
            interactive: true
        },
        xaxis: {
            mode: 'time',
            show: true,
            tickSize: [1, "second"],
          
            zoomRange: [from, null],
            panRange: [from, to],
            font: {
                color: 'white'
            },
            tickFormatter: function(val, axis) {
                var d = new Date(val);
                return d.getSeconds();
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

    return lineChart;
};
