const layout = require('./layout.ejs');
const statsCard = require('./statsCard.ejs');


module.exports = function()
{
    return layout({
      "name": arguments[0].name,
      "values": arguments[0].values,
      "currentStatsCard": statsCard(Object.assign({
        title: "今日截至当前"
      }, arguments[0])),
      "historyStatsCard": statsCard(Object.assign({
        title: "昨日"
      }, arguments[0]))
    });
};
