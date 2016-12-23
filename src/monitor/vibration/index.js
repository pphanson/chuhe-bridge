require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '06',
    unit: 'mm/s2',
    values: ['x', 'y', 'z'],
    value: 'x',
    interval: 5 * 1000
});
