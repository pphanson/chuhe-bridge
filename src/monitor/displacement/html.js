const layout = require("../../layout/html.js");
const content = require("./content.ejs");
const monitor = require("../../component/monitor/html.js");

module.exports = layout.generate(content({
  monitor: monitor({
    name: '位移',
    unit: 'mm',
    values: ['displacement']
  })
}));
