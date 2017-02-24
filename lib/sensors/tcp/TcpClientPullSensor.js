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
            let channelId = new Buffer (this.config.parameter.channel);
            let LRC = new Buffer (this.config.parameter.LRC);
            let msgEnd = new Buffer ([ 0x0d,0x0a ]);
            let list =  [msgHeader,channelId,LRC,msgEnd ];
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
            },this.config.meta._monitor.interval); //this.config.meta._monitor.interval
        }
    }

    format(msg)
    {
        let value1 = parseFloat(msg.slice(7,15));
        let value2 = parseFloat(msg.slice(15,23));
        let values = null;
        if (this.meta.name === 'deflection') {
            let G = this.config.parameter.G;
            let R0 = this.config.parameter.R0;
            if(value1 < 565)
            {
                let displacement = (G *((Math.pow(value1,2))/1000-R0)).toFixed(2);
                values = {
                    "deflection": parseFloat(displacement)
                };
            }

        }else if (this.meta.name === 'strain') {
            let G = this.config.parameter.G;
            let C = this.config.parameter.C;
            let R0 = this.config.parameter.R0;
            let K = this.config.parameter.K;
            let T0 = this.config.parameter.T0;
            let A = this.config.parameter.A;
            let B = this.config.parameter.B;
            let Ct = this.config.parameter.Ct;
            let E = this.config.parameter.E;
            let T = 1/(A+B*(Math.log(value2))+Ct*(Math.pow(Math.log(value2),3)))-273.2;
            let strain = ((G * C *(Math.pow(value1,2)/1000-R0)+ K*(T-T0))*(1e-6)*E).toFixed(2);
            values = {
                "strain": parseFloat(strain)
            };
        }
        return values;
    }

}