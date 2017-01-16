const layout = require("../../layout/html.js");
const content = require("./content.ejs");
const monitor = require("../../component/monitor/html.js");

module.exports = layout.generate(content({
  monitor: monitor({
    name: '温湿度',
    unit: '',
    values: [{name: 'temperature', text: '温度'}, {name: 'humidity', text: '湿度'}]
  })
}));
