const layout = require('../../layout/html.js');
const content = require('./content.ejs');

const trafficmonitorModule = layout.generate(content({

}))

module.exports = trafficmonitorModule;
