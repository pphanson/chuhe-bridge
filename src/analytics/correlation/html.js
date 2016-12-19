const layout = require('../../layout/html.js');
const content = require('./content.ejs');

const correlationModule = layout.generate(content({
    title:'挠度传感器'
}))

module.exports = correlationModule;