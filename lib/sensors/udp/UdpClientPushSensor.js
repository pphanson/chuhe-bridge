import logger from "winston";
import {
    Double
} from "mongodb";

import serverSocket from "../../server/udpServer";
import Sensor from "../Sensor";

export default class UdpClientPushSensor extends Sensor {
    constructor(config) {
        super(config);
        this.initMonitor();
    }

    initRouter() {
        super.initRouter();
    }

    initMonitor() {
        serverSocket.on(`${this.id}:data`, function(e) {
            let value = this.format(e.msg);
            console.log(`sensor-${this.id} recieved data: ${e.msg}, ${JSON.stringify(value)}`);
            if (value !== null && value !== undefined)
            {
                this.setValue(value);

                this.alarmHandler(value);
            }
        }.bind(this));
    }

    format(msg) {
      let displacementReg = /A\d\d\d\d(WY(.*))B/;
      let deflectionReg = /A\d\d\d\d(ND(.*))B/;
      let verticalityReg = /A\d\d\d\d(CZD(.*))B/;
      let strainReg = /A\d\d\d\d(YB(.*))B/;
      let cableforceReg = /A\d\d\d\d(SL(.*))B/;
      let acceReg = /A\d\d\d\d(X(.*)Y(.*)Z(.*))B/;
      let wsdReg = /A\d\d\d\d(WD(.*)SD(.*))B/;
      let corrosionReg = /A\d\d\d\d(FSA(.*)B(.*))B/;
      let result;
      let values;

      if (this.meta.name === 'displacement') {
          result = displacementReg.exec(msg);
          values = {
              "displacement": parseFloat(result[2])
          };
      }else if (this.meta.name === 'deflection') {
          result = deflectionReg.exec(msg);
          values = {
              "deflection": parseFloat(result[2])
          };
      }else if (this.meta.name === 'verticality') {
          result = verticalityReg.exec(msg);
          if( result[2] == "1" || result[2] == "-1" )
          {
              values = null;
              console.log(values)
          }
          else{
              values = {
                  "verticality": parseFloat(result[2])
              };
          }
      }else if (this.meta.name === 'strain') {
          result = strainReg.exec(msg);
          values = {
              "strain": parseFloat(result[2])
          };
      }else if (this.meta.name === 'cableforce') {
          result = cableforceReg.exec(msg);
          values = {
              "cableforce": parseFloat(result[2])
          };
      }else if (this.meta.name === 'vibration') {
          result = acceReg.exec(msg);
          values = {
              "x": (parseFloat(result[2])) * 9.8 * 100 / 16328,
              "y": (parseFloat(result[3])) * 9.8 * 100 / 16328,
              "z": (parseFloat(result[4])) * 9.8 * 100 / 16328
          };
      }else if (this.meta.name === 'temperature and humidity') {
          result = wsdReg.exec(msg);
          values = {
              "temperature": parseFloat(result[2]),
              "humidity": parseFloat(result[3])
          };
      } else if (this.meta.name === 'corrosion') {
          result = corrosionReg.exec(msg);
          values = {
              "corrosion": parseFloat(result[2])
          };
      }else if (this.meta.name === 'trafficload') {
          values = {
              "datalength": parseInt((msg.slice(4,6)).toString(),16),
              "id":String.fromCharCode((msg.slice(6,38)).toString('utf8')),
              "lane":parseInt((msg.slice(68,70)).toString(),16),
              "licenseplate":(msg.slice(70,90)).toString('utf8'),
              "axesnumber": parseInt((msg.slice(90,92)).toString(),16),
              "weight":parseInt((msg.slice(92,96)).toString(),16),
              "time":parseInt((msg.slice(96,100)).toString(),16),
              "weightlimit": parseInt((msg.slice(110,114)).toString(),16),
              "overweight":parseInt((msg.slice(114,118)).toString(),16),
              "axesweight1":parseInt((msg.slice(118,122)).toString(),16),
              "axesweight2": parseInt((msg.slice(122,126)).toString(),16),
              "axesweight3":parseInt((msg.slice(126,130)).toString(),16),
              "axesweight4":parseInt((msg.slice(130,134)).toString(),16),
              "axesweight5": parseInt((msg.slice(134,138)).toString(),16),
              "axesweight6":parseInt((msg.slice(138,142)).toString(),16),
              "axesweight7":parseInt((msg.slice(142,146)).toString(),16),
              "axesweight8": parseInt((msg.slice(146,150)).toString(),16),
              "axesvelocity1":parseInt((msg.slice(150,152)).toString(),16),
              "axesvelocity2":parseInt((msg.slice(152,154)).toString(),16),
              "axesvelocity3": parseInt((msg.slice(154,156)).toString(),16),
              "axesvelocity4":parseInt((msg.slice(156,158)).toString(),16),
              "axesvelocity5":parseInt((msg.slice(158,160)).toString(),16),
              "axesvelocity6": parseInt((msg.slice(160,162)).toString(),16),
              "axesvelocity7":parseInt((msg.slice(162,164)).toString(),16),
              "axesvelocity8":parseInt((msg.slice(164,166)).toString(),16),
              "shaftspacing12": parseInt((msg.slice(166,170)).toString(),16),
              "shaftspacing23":parseInt((msg.slice(170,174)).toString(),16),
              "shaftspacing34":parseInt((msg.slice(174,178)).toString(),16),
              "shaftspacing45": parseInt((msg.slice(178,182)).toString(),16),
              "shaftspacing56":parseInt((msg.slice(182,186)).toString(),16),
              "shaftspacing67":parseInt((msg.slice(186,190)).toString(),16),
              "shaftspacing78": parseInt((msg.slice(190,194)).toString(),16),
              "totalwheelbase":parseInt((msg.slice(194,198)).toString(),16),
              "carlength":parseInt((msg.slice(198,202)).toString(),16),
              "fronthanginglong": parseInt((msg.slice(202,206)).toString(),16),
              "afterhanginglong":parseInt((msg.slice(206,210)).toString(),16),
              "vehiclespacing":parseInt((msg.slice(210,214)).toString(),16),
              "direction": parseInt((msg.slice(214,216)).toString(),16),
              "vehicletype":parseInt((msg.slice(216,220)).toString(),16),
              "violationtype":parseInt((msg.slice(220,222)).toString(),16),
              "temperature": parseInt((msg.slice(222,224)).toString(),16),
              "correctnesstype":parseInt((msg.slice(224,226)).toString(),16),
              "vehiclespacingtime":parseInt((msg.slice(226,230)).toString(),16),
              "axesgroupweight1": parseInt((msg.slice(230,234)).toString(),16),
              "axesgroupweight2":parseInt((msg.slice(234,238)).toString(),16),
              "axesgroupweight3":parseInt((msg.slice(238,242)).toString(),16),
              "axesgroupweight4": parseInt((msg.slice(242,246)).toString(),16),
              "axesgroupweight5":parseInt((msg.slice(246,250)).toString(),16),
              "axesgroupweight6":parseInt((msg.slice(250,254)).toString(),16),
              "axesgroupweight7": parseInt((msg.slice(254,258)).toString(),16),
              "axesgroupweight8":parseInt((msg.slice(258,262)).toString(),16),
              "axesequivalentload1":parseInt((msg.slice(262,266)).toString(),16),
              "axesequivalentload2": parseInt((msg.slice(266,270)).toString(),16),
              "axesequivalentload3":parseInt((msg.slice(270,274)).toString(),16),
              "axesequivalentload4":parseInt((msg.slice(274,278)).toString(),16),
              "axesequivalentload5": parseInt((msg.slice(278,282)).toString(),16),
              "axesequivalentload6":parseInt((msg.slice(282,286)).toString(),16),
              "axesequivalentload7":parseInt((msg.slice(286,290)).toString(),16),
              "axesequivalentload8": parseInt((msg.slice(290,294)).toString(),16),
              "passingtime":parseInt((msg.slice(294,298)).toString(),16),
              "followtag":parseInt((msg.slice(298,300)).toString(),16),
              "temperaturetag": parseInt((msg.slice(300,302)).toString(),16)
          };
      }

      return values;
  }
}
