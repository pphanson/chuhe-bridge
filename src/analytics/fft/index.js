require('./style.less');

const {linechartTime, seriesTime} = require('./timelinechart');
const {linechartFft, seriesFft} = require('./fftlinechart');
const bridgeScene = require('./bridge');
const requestUtil = require('../../monitor/common/remote');


let type = 'vibration';
requestUtil.fetchSensors(type).then(data => {
    initSensorlist(type, data);
});


function initSensorlist(type, data) {
    var $ul = $('ul#vibration-dropdown');
    data.forEach((item) => {
        let $li = $(`<li id=${item.id}><a href='#'><span>${item.name}</span></a></li>`);
        $li.data(item);
        $ul.append($li);
    });

    $ul.on('click', 'li', function (e) {
        selectSensorItem(type, $(e.currentTarget).data())
    })

    function selectSensorItem(type, item) {
        var $selectedSensorItem = $(`ul#vibration-dropdown li.chuhe-sensor-item-selected`);
        var $sensorItem = $(`ul#vibration-dropdown  li#${item.id}`);
        var $chardTitle = $(`a#${type}-title`);

        $chardTitle.html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
        $sensorItem.addClass("chuhe-sensor-item-selected");
        $selectedSensorItem.removeClass("chuhe-sensor-item-selected");


    }
}

    $('input#clickid').on('click', e => {

    let from = new Date(document.getElementById("beginTime").value);
    let to = new Date(document.getElementById("endTime").value);
    let id = $("ul#vibration-dropdown li.chuhe-sensor-item-selected").attr("id");

    requestUtil.getAnalytics(id, from.toJSON(), to.toJSON()).then(data => {
        seriesTime.data = data.timeArray;
        linechartTime.setData([seriesTime]);
        linechartTime.setupGrid();
        linechartTime.draw();

        seriesFft.data = data.sensorFft;
        linechartFft.setData([seriesFft]);
        linechartFft.setupGrid();
        linechartFft.draw();

    });

});

