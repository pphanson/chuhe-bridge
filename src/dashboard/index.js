require('./style.less');

///////////////// Map ///////////////////////////

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
        let $li = $(`<li id=${item.id}><a href='#'><i>${item.name}</i></a></li>`);
        $li.data(item);
        $ul.append($li);
        if (index === 0) {
            selectSensorItem(type, item);
        }
    });

    $ul.on('click', 'li', function(e) {
        selectSensorItem(type, $(e.currentTarget).data())
    })
}


function selectSensorItem(type, item) {
    var $selectedSensorItem = $(`div#${type}-card  li.chuhe-sensor-item-selected`);
    var $sensorItem = $(`div#${type}-card  li#${item.id}`);
    var $chardTitle = $(`div#${type}-card a#${type}-card-title`);

    $chardTitle.html(item.name + "<i class='mdi-navigation-arrow-drop-down right'></i>");
    $sensorItem.addClass("chuhe-sensor-item-selected");
    $selectedSensorItem.removeClass("chuhe-sensor-item-selected");
    selectedSensors[type] = item.id;
}

$.ajax({
    url: "http://localhost:3000/sensors",
    dataType: 'json'
}).done(function(data) {
    for (let type in data) {
        initSensorlist(type, data[type]);
    }
});


///////////////// bridge3d ///////////////////////////
let bridgeScene = new bridge3d.BridgeScene({
    $element: $("#chuhe-bridge-scene"),
    bridgeModelUrl: "/models/bridge.obj"
});
bridgeScene.startAnimation();

bridgeScene.on("load", function(e) {
    let sensorIds = Object.values(selectedSensors);
    this.bridge.showSensors(sensorIds);
});

bridgeScene.on("sensorclick", function(e) {
    console.log(e.sensor);
    this.bridge.focusOnSensor(e.sensor);
});

$(window).on("resize", function(e) {
    bridgeScene.invalidateSize();
});
