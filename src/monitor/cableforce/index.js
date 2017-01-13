require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '05',
    min: 0,
    max: 1000,
    unit: 'kN',
    value: 'cableforce',
    interval: 60 * 1000,
});
