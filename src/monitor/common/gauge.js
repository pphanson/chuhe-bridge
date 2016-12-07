module.exports = function(options) {
    const g = new JustGage({
        id: 'chuhe-realtime',
        min: 0,
        max: 100,
        title: "当前",
        label: options.unit,
        valueFontColor: 'white',
        levelColorsGradient: true,
        levelColors: ["#6aff7d", "#ff5665"],
    });
    return g;
};
