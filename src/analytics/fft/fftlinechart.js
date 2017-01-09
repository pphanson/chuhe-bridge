/**
 *傅里叶分析下方的频率变换
 */
const seriesFft = {
  color: 'green',
  fill: true,
  fillColor: {colors: ['rgb(41, 176, 146)', 'rgb(64, 112, 138)']}
};

const lineChartFft = $(".chuhe-fft-linechart > .chuhe-linechart-content").plot([seriesFft], {
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
    lineChartFft.resize();
    lineChartFft.setupGrid();
    lineChartFft.draw();
});

module.exports = {
    linechartFft: lineChartFft,
    seriesFft: seriesFft
}


