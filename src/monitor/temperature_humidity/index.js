require("./style.less");

const monitor = require('../');
const { fetchSensorDat } = require('../common/remote');
const { id, lineChart, gauge, bridgeScene } = monitor({
    type: '07',
    unit: '',
    values: ['temperature', 'humidity'],
    value: 'temperature',
    min: -20,
    max: 100});
