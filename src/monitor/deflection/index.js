require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '02',
    min: 0,
    max: 300,
    unit: 'mm',
    value: 'deflection',
    interval: 60 * 1000
});
