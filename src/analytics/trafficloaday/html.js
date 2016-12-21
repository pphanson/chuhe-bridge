const layout = require('../../layout/html.js');
const content = require('./content.ejs');

const trafficloadayModule = layout.generate(content({

}))

module.exports = trafficloadayModule;