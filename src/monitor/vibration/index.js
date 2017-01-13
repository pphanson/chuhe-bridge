require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '06',
    min: -1960,
    max: 1960,
    unit: 'mm/s²',
    values: ['x', 'y', 'z'],
    value: 'x',
    interval: 5 * 1000
});
