require('./style.less');

const {upleftchart, upleft} = require('./upLeftChart');
const {uprightchart, upright} = require('./upRightChart');
const {downleftchart, downleft} = require('./downLeftChart');
const {downrightchart, downright} = require('./downRightChart');
const requestUtil = require('../../monitor/common/remote');

fetchTrafficData();
function fetchTrafficData () {
    requestUtil.getTrafficMonth().then((data) => {
        
        upleftchart.data = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]];
        upleft.setData([upleftchart]);
        upleft.setupGrid();
        upleft.draw();

        uprightchart.data = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]];
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
