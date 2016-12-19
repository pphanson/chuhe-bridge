require('./style.less');

const {linechartTime, seriesTime} = require('./timelinechart');
const bridgeScene = require('./bridge');
const requestUtil = require('../../monitor/common/remote');
const Meta = require('../../monitor/common/meta');
let sensorMeta;

requestUtil.fetchSensorsMeta().then(data => {

})

requestUtil.fetchSensors().then(data => { //data: 01,02,03,04,05,06,07,08,09 type
    for (let type in data) {
        initSensorlist(type);
      //  alert(data[type]);
    };
});
function initSensorlist(type, data) {
    var $ul = $('ul#sensorType-dropdown');
    data.forEach((item, index) => {
        let $li = $(`<li id=${item.id}><a href='#'><span>${item.Meta.getSensorMetaName(type)}</span></a></li>`);
       // alert(item);
        $li.data(item);
        $ul.append($li);
        if (index === 0) {
            selectSensorItem(item, true);
        }
    });
    $ul.on('click', 'li', function(e) {
        selectSensorItem($(e.currentTarget).data(), true)
    })
}


