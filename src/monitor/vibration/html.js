const layout = require("../../layout/html.js");
const content = require("./content.ejs");
const monitor = require("../../component/monitor/html.js");

module.exports = layout.generate(content({
  monitor: monitor({
    name: '振动',
    unit: 'mm/s&#178',
    values: ['x', 'y', 'z']
  })
}));
