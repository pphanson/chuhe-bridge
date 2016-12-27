const layout = require('../../layout/html.js');
const content = require('./content.ejs');

const specialdetailModule = layout.generate(content({
    title:'请选择传感器'
}))

module.exports = specialdetailModule;
