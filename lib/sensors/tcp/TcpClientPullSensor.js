import logger from "winston";
import Sensor from "../Sensor";
import tcpServerSocket from "../../server/tcpServer";

export default class TcpClientPullSensor extends Sensor {
    constructor(config) {
        super(config);
        this._monitoring = false;
    }

    initRouter() {
        super.initRouter();
    }

    get monitoring()
    {
        return this._monitoring;
    }

    startMonitor()
    {
        this.updateValuePoll();
    }

    stopMonitor()
    {
        this._monitoring = false;
    }

    updateValuePoll()
    {
        if (!this.monitoring)
        {
            let msgHeader = new Buffer([ 0x3a,0x30,0x43,0x32,0x31]);
            let msgId = new Buffer (this.config.id);
            let msgEnd = new Buffer ([ 0x43,0x41,0x0d,0x0a ]);
            let list =  [msgHeader,msgId,msgEnd ];
            let msg = Buffer.concat(list);

            // 为客户端添加“data”事件处理函数，data是服务器发回的数据
            tcpServerSocket.on(`${this.id}:data`, function(data) {
                let value = this.format(data.data);
                if (value !== null && value !== undefined)
                {
                    this.setValue(value);
                    this.alarmHandler(value);
                }
            }.bind(this));

            this._monitoring = true;

            setInterval(async () => {
                try
                {
                    await tcpServerSocket._client.write(msg);
                }
                catch (e)
                {
                    logger.error(e);
                }
            },this.config.meta._monitor.interval);
        }
    }

    format(msg)
    {
        let value1 = parseFloat(msg.slice(9,17));
        let value2 = parseFloat(msg.slice(17,25));
        let values;
        if (this.meta.name === 'deflection') {
            let G = 0.1;
            let R0 = 300;
            let displacement = (G *((Math.pow(value1,2))/1000-R0)).toFixed(2);
            values = {
                "deflection": parseFloat(displacement)
            };
        }else if (this.meta.name === 'strain') {
            let G = 0.0065;
            let R0 = 565;
            let K = 1.8;
            let T0 = 22;
            let A = 1.4051e-3;
            let B = 2.369e-4;
            let C = 1.019e-7;
            let T = 1/(A+B*(Math.log(value2))+C*(Math.pow(Math.log(value2),3)));
            let strain = (G *(Math.pow(value1,2)/1000-R0)+ K*(T-T0)).toFixed(2);
            values = {
                "strain": parseFloat(strain)
            };
        }
        return values;
    }

}