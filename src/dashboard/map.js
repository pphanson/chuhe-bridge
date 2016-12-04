const mapStyle = {
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

const map = new BMap.Map("map");
const point = new BMap.Point(119.003062, 32.258956);

map.setMapStyle(mapStyle);
map.centerAndZoom(point, 16);

module.exports = map;
