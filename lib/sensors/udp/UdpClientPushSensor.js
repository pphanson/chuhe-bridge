import logger from "winston";

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
      let wsdReg = /A\d\d\d\d(wd(.*)sd(.*)%)B/;
      let corrosionReg = /A\d\d\d\d(FS(.*))B/;
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
          values = {
              "verticality": parseFloat(result[2])
          };
      }else if (this.meta.name === 'strain') {
          result = strainReg.exec(msg);
          values = {
              "strain": parseFloat(result[2])
          };
      }else if (this.meta.name === 'cableforce') {
          result = cableforceReg.exec(msg);
          values = {
              "baseband": parseFloat(result[2])
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
      }

      return values;
  }
}
