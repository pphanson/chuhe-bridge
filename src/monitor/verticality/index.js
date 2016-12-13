require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: 'verticality',
    unit: '',
    value: 'verticality',
    interval: 60 * 1000
});
