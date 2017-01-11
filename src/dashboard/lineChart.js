module.exports = function(id, collection, fillColor) {
    const options = {
        lines: {
            show: true,
            fill: true,
            color: 'white',
            fillColor: fillColor || {colors: ['rgb(41, 176, 146)', 'rgb(64, 112, 138)']}
        },
        points: {
            show: false
        }
    };

    let lineChart = $(`div#${id}-card > div.card-lineChart-container > div#${id}-card-lineChart`).plot(collection || [], {
        series: options,
        xaxis: {
            show: false,
            font: {
                color: 'white'
            }
        },
        yaxis: {
            show: false,
            font: {
                color: 'white'
            }
        },
        grid: {
            show: true,
            color: '#9b99ff',
            borderWidth: {
                left: 1,
                bottom: 1,
                top: 0,
                right: 0
            },

            borderColor: {
                left: '#9b99ff',
                bottom: '#9b99ff'
            }
        }
    }).data("plot");

    $(window).on('resize', function() {
        lineChart.resize();
        lineChart.setupGrid();
    });

    return lineChart;
};
