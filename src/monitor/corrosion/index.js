require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '08',
    min: 0,
    max: 10,
    unit: 'μm',
    value: 'corrosion',
    interval: 60 * 60 * 1000
});
