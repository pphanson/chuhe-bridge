const seriesTime = {
 // data: [[(new Date(2000, 10, 1)).getTime(), 3],[(new Date(2000, 11, 1)).getTime(), 4],[(new Date(2000, 12, 1)).getTime(), 6]],
  color: 'white',
  fill: true,
  fillColor: {colors: ['rgb(41, 176, 146)', 'rgb(64, 112, 138)']}
};

const lineChartTime = $(".chuhe-time-linechart > .chuhe-linechart-content").plot([seriesTime], {
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
    //xaxis: {
    //  mode: 'time',
    //  show: true,
    //  font: {
    //      color: 'white'
    //  },
    //  tickFormatter: function(value)
    //  {
    //      var d = new Date(value);
    //      return `${d.getFullYear()}- ${d.getMonth()}-${d.getDate()}`;
    //  }
    //},
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
    lineChartTime.resize();
    lineChartTime.setupGrid();
    lineChartTime.draw();
});

module.exports = {
  linechartTime: lineChartTime,
  seriesTime: seriesTime
}


