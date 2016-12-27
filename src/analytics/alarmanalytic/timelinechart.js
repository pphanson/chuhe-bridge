const series = {

    fill: true,
}
const pieChart = $("#chuhe-sensorSingle").plot(series, {
    series: {
        pie: {
            show: true,
            radius: 1,
            label: {
                show: true,
                radius: 1,
                background: {
                    opacity: 0.8
                }
            }
        }
    },
    legend: {
        show: true
    }
}).data('plot');

$(window).on('resize', function() {
    pieChart.resize();
    pieChart.drawLabels();
});

module.exports = {
    piechart: pieChart,
    series: series,
}
