let iInterval;

function getTickSize() {
    if (iInterval < 60 * 1000) {
        if (iInterval % 30 * 1000 === 0 )
        {
            return [30, 'second'];
        }
        else if (iInterval % 10 * 1000  === 0 )
        {
            return [10, 'second'];
        }
        else if (iInterval % 5 * 1000  === 0 )
        {
            return [5, 'second'];
        }
        else if (iInterval % 2 * 1000  === 0 )
        {
            return [2, 'second'];
        }
        else
        {
            return [1, 'second'];
        }
    } else if (iInterval < 60 * 60 * 1000) {
      if (iInterval % 30 *  60 * 1000)
      {
          return [30, 'minute'];
      }
      else if (iInterval % 10 *  60 * 1000  === 0 )
      {
          return [10, 'minute'];
      }
      else if (iInterval % 5 *  60 * 1000  === 0 )
      {
          return [5, 'minute'];
      }
      else if (iInterval % 2 *  60 * 1000  === 0 )
      {
          return [2, 'minute'];
      }
      else
      {
          return [1, 'minute'];
      }
    } else if (iInterval === 60 * 60 * 1000) {
        return [1, 'hour'];
    }
}

function tickFormatter(value, axis) {
    let d = new Date(value);

    if (iInterval < 60 * 1000) {
        return d.getSeconds();
    } else if (iInterval < 60 * 60 * 1000) {
        return d.getMinutes();
    } else if (iInterval === 60 * 60 * 1000) {
        return d.getHours();
    }
}

module.exports = function({
    from,
    to,
    interval,
    collection
}) {

    const options = {
        lines: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: {
                colors: ['rgba(64, 24, 185, 0.2)','rgba(64, 24, 185, 1)'],
            },
        },
        points: {
            show: true,
        },
    };

    iInterval = interval;

    let lineChart = $(".chuhe-linechart-content").plot(collection, {
        series: options,
        zoom: {
            interactive: false
        },
        pan: {
            interactive: false
        },
        xaxis: {
            mode: 'time',
            show: true,
            tickSize: getTickSize(),
            font: {
                color: 'white'
            },
            tickFormatter: tickFormatter
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
