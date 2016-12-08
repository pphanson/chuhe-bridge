
const layout = require('../../layout/html.js');
const content = require('./content.ejs');

const fftModule = layout.generate(content({
  name: '傅立叶变换'
}))

module.exports = fftModule;
