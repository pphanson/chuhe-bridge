module.exports = function(options) {
    const g = new JustGage({
        id: 'chuhe-realtime',
        min: options.min,
        max: options.max,
        title: "当前",
        label: options.unit,
        valueFontColor: 'white',
        levelColorsGradient: true,
        levelColors: ["#6aff7d", "#ff5665"],
    });
    return g;
};
