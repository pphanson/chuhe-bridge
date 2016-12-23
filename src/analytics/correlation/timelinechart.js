const series = {
  //data: [[(new Date(2000, 10, 1)).getTime(), 3],[(new Date(2000, 11, 1)).getTime(), 4],[(new Date(2000, 12, 1)).getTime(), 6]],
  color: 'green',
  fill: true,
  fillColor: {colors: ['rgb(41, 176, 146)', 'rgb(64, 112, 138)']}
};

const lineChart = $(".chuhe-correlationLineChart-contant").plot([series], {
    series: {
      lines: {
          show: false
      },
      points: {
          show: true
      }
    },
    zoom: {
        interactive: false
    },
    pan: {
        interactive: false
    },
    // xaxis: {
    //   mode: 'time',
    //   show: true,
    //   font: {
    //       color: 'white'
    //   },
    //   tickFormatter: function(value)
    //   {
    //       var d = new Date(value);
    //       return `${d.getFullYear()}- ${d.getMonth()}-${d.getDate()}`;
    //   }
    // },
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
  linechart: lineChart,
  series: series
}
