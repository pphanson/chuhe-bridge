require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '03',
    min: -180,
    max: 180,
    unit: '°',
    value: 'verticality',
    interval: 60 * 1000,
});
