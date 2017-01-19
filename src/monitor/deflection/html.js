const layout = require("../../layout/html.js");
const content = require("./content.ejs");
const monitor = require("../../component/monitor/html.js");

module.exports = layout.generate(content({
    monitor: monitor({
        name: '挠度',
        unit: 'mm',
        values: ['deflection'],
    }),
}));
