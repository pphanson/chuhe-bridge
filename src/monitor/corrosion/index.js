require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '08',
    unit: 'mm/a',
    value: 'corrosion',
    interval: 60 * 60 * 1000
});
