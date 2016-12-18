require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '03',
    unit: '',
    value: 'verticality',
    interval: 60 * 1000
});
