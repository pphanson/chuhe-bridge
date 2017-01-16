require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '09',
    min: 0,
    max: 1000,
    unit: 'kN',
    value: 'weight',
    interval: 100
});
