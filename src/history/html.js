const layout = require("../layout/html");
const content = require("./content.ejs");

const historyModule = layout.generate(content({
    title: '振动传感器'

}))

module.exports = historyModule;