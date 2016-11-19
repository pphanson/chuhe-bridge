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
            this.setValue(value);
        }.bind(this));
    }

    format(msg) {
        let wsdReg = /A\d\d\d\d(wd(.*)sd(.*)%)B/;
        let acceReg = /A\d\d\d\d(X(.*)Y(.*)Z(.*))B/;
        let result;
        let values;

        if (this.meta.name === 'temperature and humidity') {
            result = wsdReg.exec(msg);
            values = {
                "temperature": parseFloat(result[2]),
                "humidity": parseFloat(result[3])
            };
        } else if (this.meta.name === 'vibration') {
            result = acceReg.exec(msg);
            values = {
                "x": (parseFloat(result[2])) * 9.8 * 100 / 16328,
                "y": (parseFloat(result[3])) * 9.8 * 100 / 16328,
                "z": (parseFloat(result[4])) * 9.8 * 100 / 16328
            };
        }

        return values;
    }
}
