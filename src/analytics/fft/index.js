require('./style.less');

const {linechart, series} = require('./timelinechart');
const bridgeScene = require('./bridge');
const requestUtil = require('../../monitor/common/remote');

setTimeout(() => {
    series.data = [[(new Date(2000, 10, 1)).getTime(), 33],[(new Date(2000, 11, 1)).getTime(), 42],[(new Date(2000, 12, 1)).getTime(), 2]];
    linechart.setData([series]);
    linechart.setupGrid();
    linechart.draw();
}, 2000)


const timeInterval = {
  'strain': 60 * 1000,
  'displacement': 60 * 1000,
  'verticality': 60 * 1000,
  'deflection': 60 * 1000,
  'vibration': 5 * 1000,
  'cableforce': 60 * 1000,
  'corrosion': 60 * 60 * 1000
};



