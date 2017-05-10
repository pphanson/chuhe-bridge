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
          if (verticalityValues > 0 ){
              verticalityValues = verticalityValues - 180;
          }else{
              verticalityValues = verticalityValues + 180;
          }
          if (verticalityValues > 10 || verticalityValues < -10)
          {
              values = {
                  "verticality": parseFloat(0)
              };
          }else{
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
          let cableforceValues = parseFloat(result[2]);
          if (cableforceValues > 15 || cableforceValues < 5 )
          {
              cableforceValues = 10;
          }
          let p = this.config.parameter.p;
          let L = this.config.parameter.L;
          cableforceValues = 4 * p * Math.pow(L,2) * Math.pow(cableforceValues,2);
          values = {
              "cableforce": parseFloat(cableforceValues.toFixed(0))
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
          let aveStr = (msg.slice(0, 8)).toString();
          let maxStr = (msg.slice(8, 16)).toString();
          let aveArray = [];
          let maxArray = [];
          for (let i = 0; i < aveStr.length; i += 2) {
              let temp1 = parseInt(aveStr[i] + aveStr[i + 1], 16);
              let temp2 = parseInt(maxStr[i] + maxStr[i + 1], 16);
              temp1 = temp1.toString(16);
              if(temp1.length >= 2)
              {
               }else{
                  temp1 = "0" + temp1;
               }
              aveArray[i / 2] = new Buffer(temp1,'hex');
              temp2 = temp2.toString(16);
              if(temp2.length >= 2)
              {
              }else{
                  temp2 = "0" + temp2;
              }
              maxArray[i / 2] = new Buffer(temp2,'hex');
          }
          let aveBuffer = Buffer.concat(aveArray);
          let maxBuffer = Buffer.concat(maxArray);
          let CorrAvg = aveBuffer.readFloatBE();
          let CorrMax = maxBuffer.readFloatBE();
          values = {
              "CorrAvg": parseFloat(CorrAvg.toFixed(2)),
              "CorrMax": parseFloat(CorrMax.toFixed(2)),
          };
      }else if (this.meta.name === 'crack') {
          let an = msg.readFloatLE();
          let a0 = this.config.parameter.a0;
          let RChangeRate = (an-a0)/a0;
          if(RChangeRate > 0.25){
              let d = (Math.log((RChangeRate - 0.15)/0.101))/9.188;
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
