const layout = require("../layout/html");
const content = require("./content.ejs");
const card = require("../component/card/card.ejs");
const legend = require("../component/legend.ejs");
const indicator = require("../component/indicator.ejs");
const description = "沿江开发高等级公路（南京江北段）,横越滁河，滁河为长江支流，五级航道，过往船只较多，河面宽度70~200m，水深2~8m。滁河大桥位于R=4000m的平曲线上，主桥为72m下承式钢筋混凝土系杆拱，引桥为30m预应力混凝土组合箱梁，全桥共分七联，全长709.4米，主桥总宽33m，桥面横坡2%。本监测系统根据滁河大桥结构形式的特点，监测的内容包括关键截面的温度、应变、位移、加速度、索力、腐蚀及交通荷载、流量等。传感器布设以状态评估的需求出发，以有效和经济为主，使测点能够发挥最大效应的原则，并综合考虑了结构计算分析结果以及构件重要性、易损性等多方面的因素。";

module.exports = layout.generate(content({
  "description":description,
  "legend": legend(),
  "indicator": indicator({
      items: [{
        name: 'flow',
        unit: 'veh/15min',
        title: '流量'
      },{
        name: 'trafficload',
        unit: 'kN',
        title: '荷载'
      },{
        name: 'strain',
        unit: 'MPa',
        title: '应变'
      }]
  }),
  "deflectionSensor": card({
      id: 'deflection-card',
      title: "绕度传感器",
      className: "chuhe-deflection-card",
      name: "挠度",
      unit: "mm"
  }),
  "displacementSensor": card({
      id: 'displacement-card',
      title: "位移传感器",
      className: 'chuhe-displacement-card',
      name: "位移",
      unit: "mm"
  }),
  "verticalitySensor": card({
      id: "verticality-card",
      title: "垂直度传感器",
      className: 'chuhe-verticality-card',
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
  "cableforceSensor": card({
      id: "cableforce-card",
      title: "索力传感器",
      className: 'chuhe-cableforce-card',
      name: "索力",
      unit: "kN"
  }),
  "vibrationSensor": card({
      id: "vibration-card",
      title: "振动传感器",
      className: 'chuhe-vibration-card',
      name: "振动",
      unit: "mm/s&#178"
  }),
  "trafficloadSensor": card({
      id: "trafficload-card",
      title: "荷载传感器",
      className: 'chuhe-trafficload-card',
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
