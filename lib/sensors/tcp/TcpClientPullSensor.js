import logger from "winston";
import net from "net";
import Sensor from "../Sensor";

export default class TcpClientPullSensor extends Sensor {
    constructor(config) {
        super(config);
        this.startMonitor();
        this._monitoring = true;
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
        this._monitoring = true;
        this.updateValuePoll();
    }

    stopMonitor()
    {
        this._monitoring = false;
    }

    updateValuePoll()
    {
        if (this.monitoring)
        {
            let HOST = '127.0.0.1';
            let PORT = 9011;
            let client = new net.Socket();
            let msgHeader = new Buffer([ 0x3a,0x30,0x43,0x32,0x31]);
            let msgId = new Buffer (this.config.id);
            let msgEnd = new Buffer ([ 0x44,0x32,0x0d,0x0a ]);
            let list =  [msgHeader,msgId,msgEnd ];
            let msg = Buffer.concat(list);

            client.connect(PORT, HOST, function() {
                console.log('CONNECTED TO: ' + HOST + ':' + PORT);
            });

            // 为客户端添加“data”事件处理函数，data是服务器发回的数据
            client.on('data', function(data) {
                let value = this.format(data);
                if (value !== null && value !== undefined)
                {
                    this.setValue(value);
                    this.alarmHandler(value);
                }
            }.bind(this));

            // 为客户端添加“close”事件处理函数
            client.on('close', function() {
                console.log('Connection closed');
            });

            // 为客户端添加“error”事件处理函数,重新建立连接
            client.on('error',function(){
                console.log("error");
                client.connect(PORT, HOST);
            });

            setInterval(async () => {
                try
                {
                    client.write(msg);
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
        let value1 = msg.slice(9,17);
        let value2 = msg.slice(17,25);
        let values;
        if (this.meta.name === 'deflection') {
            values = {
                "deflection": parseFloat(value1)
            };
        }else if (this.meta.name === 'strain') {
            values = {
                "strain": parseFloat(value1)
            };
        }
        return values;
    }

}