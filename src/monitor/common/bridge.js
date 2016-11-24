module.exports = function() {
    const bridgeScene = new bridge3d.BridgeScene({
        $element: $("div.chuhe-3d"),
        bridgeModelUrl: "/models/bridge.obj"
    });
    bridgeScene.startAnimation();

    bridgeScene.on("load", function(e) {
        // this.bridge.showSensors(sensorIds);
    });

    bridgeScene.on("sensorclick", function(e) {
        this.bridge.focusOnSensor(e.sensor);
    });

    $(window).on("resize", function(e) {
        bridgeScene.invalidateSize();
    });
    return bridgeScene;
};
