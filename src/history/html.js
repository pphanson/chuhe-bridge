const layout = require("../layout/html");
const content = require("./content.ejs");

const historyModule = layout.generate(content({
    title: '请选择传感器',
    unit: 'mm'

}))

module.exports = historyModule;