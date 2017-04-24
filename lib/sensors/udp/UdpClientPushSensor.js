import logger from "winston";
import gbk from "liveinjs-gbk";
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
              "displacement": parseFloat(parseFloat(result[2]).toFixed(2))
          };
      }else if (this.meta.name === 'deflection') {
          result = deflectionReg.exec(msg);
          values = {
              "deflection": parseFloat(parseFloat(result[2]).toFixed(2))
          };
      }else if (this.meta.name === 'verticality') {
          result = verticalityReg.exec(msg);
	  let verticalityValues = parseFloat(result[2]);
          if( verticalityValues  == 1 || verticalityValues  == -1 )
          {
              values = null;
          }
          else{
              
              if (verticalityValues > 0 ){
                  verticalityValues = verticalityValues - 180;
              }else{
                  verticalityValues = verticalityValues + 180;
              }
              values = {
                  "verticality": parseFloat(verticalityValues.toFixed(2))
              };
          }
      }else if (this.meta.name === 'strain') {
          result = strainReg.exec(msg);
          values = {
              "strain": parseFloat(parseFloat(result[2]).toFixed(2))
          };
      }else if (this.meta.name === 'cableforce') {
          result = cableforceReg.exec(msg);
          values = {
              "cableforce": parseFloat(parseFloat(result[2]).toFixed(0))
          };
      }else if (this.meta.name === 'vibration') {
          result = acceReg.exec(msg);
          values = {
              "x": parseFloat((parseFloat(result[2]) * 9.8 * 100 / 16328).toFixed(1)),
              "y": parseFloat((parseFloat(result[3]) * 9.8 * 100 / 16328).toFixed(1)),
              "z": parseFloat((parseFloat(result[4]) * 9.8 * 100 / 16328).toFixed(0))
          };
      }else if (this.meta.name === 'temperature and humidity') {
          result = wsdReg.exec(msg);
          values = {
              "temperature": parseFloat(parseFloat(result[2]).toFixed(1)),
              "humidity": parseFloat(parseFloat(result[3]).toFixed(1))
          };
      } else if (this.meta.name === 'corrosion') {
          result = corrosionReg.exec(msg);
          values = {
              "corrosion": parseFloat(parseFloat(result[2]).toFixed(2))
          };
      }else if (this.meta.name === 'crack') {
          let an = msg.readFloatLE();
          let a0 = this.config.parameter.a0;
          let RChangeRate = (an-a0)/a0;
          if(RChangeRate > 0.25){
              d = (Math.log((RChangeRate - 0.15)/0.101))/9.188;
              values = {
                  "crack": parseFloat(parseFloat(d).toFixed(2))
              };
          }else{
              values = {
                  "crack": 0
              };
          }
      }

      return values;
  }
}
