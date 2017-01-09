require('./style.less');

const {upleft, upleftchart} = require('./upLeftChart');
const {upright, uprightchart} = require('./upRightChart');
const {downleft, downleftchart} = require('./downLeftChart');
const {downright, downrightchart} = require('./downRightChart');
const requestUtil = require('../../monitor/common/remote');


let from = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
let to = new Date();
let sensorId = '0901';
requestUtil.getHistoryDate(from.JSON(), to.JSON(), sensorId).then((data) => {
    upleft.data = [[1,2],[2,3],[3,4],[4,5],[5,6]];
    upleftchart.setData([upleft]);
    upleftchart.setupGrid();
    upleftchart.draw();

    upright.data = [[1,2],[2,3],[3,4],[4,5],[5,6]];
    uprightchart.setData([upright]);
    uprightchart.setupGrid();
    uprightchart.draw();

    downleft.data = [[1,2],[2,3],[3,4],[4,5],[5,6]];
    downleftchart.setData([downleft]);
    downleftchart.setupGrid();
    downleftchart.draw();

    downright.data = [[1,2],[2,3],[3,4],[4,5],[5,6]];
    downrightchart.setData([downright]);
    downrightchart.setupGrid();
    downrightchart.draw();
})