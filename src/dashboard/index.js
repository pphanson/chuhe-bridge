require('./style.less');
const lineChart = require('./lineChart.js');
///////////////// Map ///////////////////////////
const displacementlineChart = lineChart('displacement');
const trafficloadlineChart = lineChart('trafficload');
const strainlineChart = lineChart('strain');
const corrisionlineChart = lineChart('corrosion');
const verticalitylineChart = lineChart('verticality');
const deflectionlineChart = lineChart('deflection');
const cableforcelineChart = lineChart('cableforce');
const vibrationlineChart = lineChart('vibration');


let mapStyle = {
    styleJson: [{
        "featureType": "land",
        "elementType": "all",
        "stylers": {
            "color": "#043348"
        }
    }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": {
            "color": "#085f87"
        }
    }, {
        "featureType": "highway",
        "elementType": "all",
        "stylers": {
            "color": "#c7e0ff"
        }
    }, {
        "featureType": "arterial",
        "elementType": "all",
        "stylers": {
            "color": "#c7e0ff"
        }
    }, {
        "featureType": "local",
        "elementType": "all",
        "stylers": {
            "color": "#c7e0ff"
        }
    }, {
        "featureType": "label",
        "elementType": "labels.text.fill",
        "stylers": {
            "color": "#333333"
        }
    }, {
        "featureType": "label",
        "elementType": "labels.text.stroke",
        "stylers": {
            "color": "#ffffff"
        }
    }]

};

let map = new BMap.Map("map");
let point = new BMap.Point(119.003062, 32.258956);

map.setMapStyle(mapStyle);
map.centerAndZoom(point, 16);

///////////////// sensor card ///////////////////////////
let selectedSensors = {};

function initSensorlist(type, data) {
    var $ul = $(`ul#${type}-card-dropdown`);

    data.forEach((item, index) => {
        let $li = $(`<li id=${item.id}><a href='#'><span>${item.name}</span></a></li>`);
        $li.data(item);
        $ul.append($li);
        if (index === 0) {
            selectSensorItem(type, item);
        }
    });
    $ul.on('click', 'li', function(e) {
        selectSensorItem(type, $(e.currentTarget).data(), true)
    })
}


function selectSensorItem(type, item, remote) {
    var $selectedSensorItem = $(`div#${type}-card  li.chuhe-sensor-item-selected`);
    var $sensorItem = $(`div#${type}-card  li#${item.id}`);
    var $chardTitle = $(`div#${type}-card a#${type}-card-title`);
    var $chardMonitorLink = $(`div#${type}-card div.chuhe-card-name > a.chuhe-monitor-link`);

    $chardMonitorLink.attr('href', `/monitor/${type}/index.html#${item.id}`);
    $chardTitle.html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    $sensorItem.addClass("chuhe-sensor-item-selected");
    $selectedSensorItem.removeClass("chuhe-sensor-item-selected");
    selectedSensors[type] = item.id;

    let sensorIds = Object.values(selectedSensors);
    bridgeScene.bridge.showSensors(sensorIds);

    if (remote) {
        $.ajax({
            url: "http://localhost:3000/sensors/data/stats",
            dataType: 'json',
            type: 'POST',
            data: {
                sensors: JSON.stringify([item.id]),
                from: (new Date(1479546000000)).toJSON(),
                to: (new Date(1479556800000)).toJSON()
            }
        }).then(function(e) {
            alert(JSON.stringify(e))
        });

        $.ajax({
            url: "http://localhost:3000/api/sensor/" + item.id + "/value",
            dataType: 'json',
            data: ({
                from: (new Date(1479546000000)).toJSON(),
                to: (new Date(1479556800000)).toJSON()
            })
        }).then(function(e) {
            // alert(JSON.stringify(e))
        });
    }
}

$.ajax({
    url: "http://localhost:3000/sensors/data",
    contentType: 'application/json; charset=utf-8',
    dataType: 'json'
}).then(function(data) {
    for (let type in data) {
        initSensorlist(type, data[type]);
    }
    let now = new Date();
    let from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    let to = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59);

    return $.ajax({
        url: "http://localhost:3000/sensors/data/stats",
        type: 'POST',
        dataType: "json",
        data: ({
            sensors: JSON.stringify(Object.values(selectedSensors)),
            from: (new Date(1479546000000)).toJSON(),
            to: (new Date(1479556800000)).toJSON()
        })
    });
}).then(function(data) {
    // alert(JSON.stringify(data));
});


///////////////// bridge3d ///////////////////////////
let bridgeScene = new bridge3d.BridgeScene({
    $element: $("#chuhe-bridge-scene.chuhe-3d-content"),
    bridgeModelUrl: "/models/bridge.obj"
});
bridgeScene.startAnimation();

bridgeScene.on("load", function(e) {
    let sensorIds = Object.values(selectedSensors);
    this.bridge.showSensors(sensorIds);
});

bridgeScene.on("sensorclick", function(e) {
    this.bridge.focusOnSensor(e.sensor);
});
bridgeScene.invalidateSize();

$(window).on("resize", function(e) {
    bridgeScene.invalidateSize();
});


////////////////// switch //////////////////////////////
$(".content a#chuhe-switch-button").on('click', e => {
    var $button = $(e.currentTarget);
    var $label = $button.children('i');
    var $map = $(".content #map");
    var $detail = $(".content #detail");

    $label.toggleClass('mdi-action-info');
    $label.toggleClass('mdi-navigation-cancel');
    $map.slideToggle();
    $detail.slideToggle();
});
