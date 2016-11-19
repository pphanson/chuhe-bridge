const layout = require("./layout.ejs");
const header = require("../component/header.ejs");
const leftSideBar = require("../component/leftSideBar.ejs");
const rightSideBar = require("../component/rightSideBar.ejs");
const footer = require("../component/footer.ejs");


module.exports = {
    generate(content)
    {
        let options = {
            "header": header(),
            "leftSideBar": leftSideBar(),
            "rightSideBar": rightSideBar(),
            "footer": footer(),
            "content": content
        };

        return layout(options);
    }
};
