const layout = require('../../layout/html.js');
const content = require('./content.ejs');

const correlationModule = layout.generate(content({
 name:'相关性分析'
}))

module.exports = correlationModule;