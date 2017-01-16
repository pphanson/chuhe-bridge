require('./style.less');

const {upleftchart, upleft} = require('./upLeftChart');
const {uprightchart, upright} = require('./upRightChart');
const {downleftchart, downleft} = require('./downLeftChart');
const {downrightchart, downright} = require('./downRightChart');
const requestUtil = require('../../monitor/common/remote');

fetchTrafficData();
function fetchTrafficData () {
    requestUtil.getTrafficMonth().then((data) => {
        
        upleftchart.data = [[new Date(1481731200000), 2], [new Date(1481817600000), 3], [new Date(1481904000000), 4], [new Date(1481990400000), 5], [new Date(1482076800000), 6]];
        upleft.setData([upleftchart]);
        upleft.setupGrid();
        upleft.draw();

        uprightchart.data = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 2], [7, 3], [8, 4], [9, 5], [10, 6], [11, 2], [12, 3], [13, 4], [14, 5], [15, 6], [16, 2], [17, 3], [18, 4], [19, 5], [20, 6], [21, 3], [22, 4], [23, 5], [24, 6]];
        upright.setData([uprightchart]);
        upright.setupGrid();
        upright.draw();

        downleftchart.data = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]];
        downleft.setData([downleftchart]);
        downleft.setupGrid();
        downleft.draw();

        downrightchart.data = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]];
        downright.setData([downrightchart]);
        downright.setupGrid();
        downright.draw();
    });
}
