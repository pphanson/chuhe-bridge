const series1 = {
    //data: [[3, 3], [4, 4],[5, 6]],
    color: 'green',
    points: {show: true, fill: true }
    //fill: true,
   // fillColor: {colors: ['rgb(41, 176, 146)', 'rgb(64, 112, 138)']}
};

const series2 = {
  //  data: [[1, 3], [2, 4],[3, 6]],
    color: 'white',
    lines: {show: true, fill: false }
   // fill: true,
  //  fillColor: {colors: ['rgb(41, 176, 146)', 'rgb(64, 112, 138)']}
};

const lineChart = $(".chuhe-correlationLineChart-contant").plot([series1, series2], {
    lable:{

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
  series1: series1,
  series2: series2,
}
