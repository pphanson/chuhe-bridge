const bridgeScene = new bridge3d.BridgeScene({
    $element: $("#chuhe-bridge-scene.chuhe-3d-content"),
    bridgeModelUrl: "/models/bridge.obj"
});
bridgeScene.startAnimation();

bridgeScene.on("sensorclick", function(e) {
    this.bridge.focusOnSensor(e.sensor);
});
bridgeScene.invalidateSize();

$(window).on("resize", function(e) {
    bridgeScene.invalidateSize();
});

module.exports = bridgeScene;
