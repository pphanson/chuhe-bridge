require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '11',
    min: 0,
    max: 13,
    unit: 'mm',
    value: 'crack',
    interval: 60 * 60 * 1000
});
