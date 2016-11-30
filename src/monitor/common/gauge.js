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
    // let i = 1;
    // const refresh = function() {
    //     let t = setTimeout(function() {
    //         g.refresh(i++);
    //         if (i === 100) {
    //             clearTimeout(t)
    //         }
    //         refresh(i)
    //     }, 100);
    // }
    // refresh();
};
