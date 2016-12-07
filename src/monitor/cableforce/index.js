require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: 'cableforce',
    unit: 'kN',
    value: 'baseband',
    interval: 60 * 1000
});
