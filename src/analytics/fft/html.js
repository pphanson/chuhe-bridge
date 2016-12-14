const layout = require('../../layout/html.js');
const content = require('./content.ejs');

const { fetchSensorData } = require('../../monitor/common/remote');

const fftModule = layout.generate(content({
    fetchSensorData:fetchSensorData
}));

module.exports = fftModule;
