require('./style.less');

const {upleftchart, upleft} = require('./upLeftChart');
const {uprightchart, upright} = require('./upRightChart');
const {downleftchart, downleft} = require('./downLeftChart');
const {downrightchart, downright} = require('./downRightChart');
const requestUtil = require('../../monitor/common/remote');

fetchTrafficData();
function fetchTrafficData () {
    requestUtil.getTrafficAnalytic().then((data) => {
        let data1 = data.everyDayNumber;
        let dataSet1 = [];
        for (let i = 0; i < data1.length; i++) {
            let ar = [];
            ar[0] = new Date(data1[i].time);
            ar[1] = data1[i].total;
            dataSet1.push(ar);
        }
        upleftchart.data = dataSet1;
        upleft.setData([upleftchart]);
        upleft.setupGrid();
        upleft.draw();

        let data2 = data.everyHourCar;
        let dataSet2 = [];
        for (let i = 0; i < data2.length; i++) {
            let br = [];
            br[0] = i;
            if (data2[i] === null) {
                br[1] = 0;
            } else {
                br[1] = data2[i];
            }
            dataSet2.push(br);
        }
        uprightchart.data = dataSet2;
        upright.setData([uprightchart]);
        upright.setupGrid();
        upright.draw();

        let data3 = data.everyHourWeight;
        let dataSet3 = [];
        for (let i = 0; i < data3.length; i++) {
            let cr = [];
            cr[0] = i;
            if (data3[i] === null) {
                cr[1] = 0;
            } else {
                cr[1] = data3[i];
            }
            dataSet3.push(cr);
        }
        downleftchart.data = dataSet3;
        downleft.setData([downleftchart]);
        downleft.setupGrid();
        downleft.draw();

        let data4 = data.weigthLevel;
        let dataSet4 = [];
        for (let i = 0; i < data4.length; i++) {
            let dr = [];
            dr[0] = i;
            if (data4[i] === null) {
                dr[1] = 0;
            } else {
                dr[1] = data4[i];
            }
            dataSet4.push(dr);
        }
        downrightchart.data = dataSet4;
        downright.setData([downrightchart]);
        downright.setupGrid();
        downright.draw();
    });
}
