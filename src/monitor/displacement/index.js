require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '01',
    unit: 'mm',
    value: 'displacement',
    interval: 60 * 1000
});
