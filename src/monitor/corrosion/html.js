const layout = require("../../layout/html.js");
const content = require("./content.ejs");
const monitor = require("../../component/monitor/html.js");

module.exports = layout.generate(content({
  monitor: monitor({
    name: '腐蚀',
    unit: 'μm',
    values: [{name: 'CorrAvg', text: '平均值'}, {name: 'CorrMax', text: '最大值'}]
  })
}));
