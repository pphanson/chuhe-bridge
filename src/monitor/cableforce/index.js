require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '05',
    unit: 'kN',
    value: 'cableforce',
    interval: 60 * 1000
});
