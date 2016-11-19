const layout = require("../../layout/html");
const content = require("./content.ejs");

module.exports = layout.generate(content());
