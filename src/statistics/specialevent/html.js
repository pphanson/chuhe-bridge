const layout = require('../../layout/html.js');
const content = require('./content.ejs');

const specialeventModule = layout.generate(content({
    name: '告警统计'
}));

module.exports = specialeventModule;