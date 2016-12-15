const layout = require('../../layout/html.js');
const content = require('./content.ejs');

const fftModule = layout.generate(content({
  title: '振动传感器01'
}));

module.exports = fftModule;
