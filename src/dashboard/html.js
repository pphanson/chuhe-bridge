const layout = require("../layout/html");
const content = require("./content.ejs");
const card = require("../component/card/card.ejs");

module.exports = layout.generate(content({
  "deflectionSensor": card({
      id: 'deflection-card',
      title: "绕度传感器",
      className: "chuhe-deflection-card",
      name: "绕度",
      unit: "mm"
  }),
  "shiftSensor": card({
      id: 'displacement-card',
      title: "位移传感器",
      className: 'chuhe-shift-card',
      name: "位移",
      unit: "mm"
  }),
  "perpendicularitySensor": card({
      id: "verticality-card",
      title: "垂直度传感器",
      className: 'chuhe-perpendicularity-card',
      name: "垂直度",
      unit: ""
  }),
  "strainSensor": card({
      id: "strain-card",
      title: "应变传感器",
      className: 'chuhe-strain-card',
      name: "应变",
      unit: "MPa"
  }),
  "cableSensor": card({
      id: "cableforce-card",
      title: "索利传感器",
      className: 'chuhe-cable-card',
      name: "索利",
      unit: "kN"
  }),
  "vibrationSensor": card({
      id: "vibration-card",
      title: "震动传感器",
      className: 'chuhe-vibration-card',
      name: "震动",
      unit: "mm/s&#178"
  }),
  "loadSensor": card({
      id: "trafficload-card",
      title: "荷载传感器",
      className: 'chuhe-load-card',
      name: "荷载",
      unit: "kN"
  }),
  "corrosionSensor": card({
      id: "corrosion-card",
      title: "腐蚀度传感器",
      className: 'chuhe-corrosion-card',
      name: "腐蚀度",
      unit: "mm/a"
  })
}));
