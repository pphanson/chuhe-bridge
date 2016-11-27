const layout = require("../../layout/html.js");
const content = require("./content.ejs");
const monitor = require("../../component/monitor/html.js");

module.exports = layout.generate(content({
  monitor: monitor({
    name: '索利',
    unit: 'kN',
    values: ['baseband']
  })
}));
