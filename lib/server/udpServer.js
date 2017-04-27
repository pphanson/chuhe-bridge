import logger from "winston";
import dgram from "dgram";
import events from "events";
import dtu from "../util/dtu.js";

class ServerSocket extends events.EventEmitter
{
    constructor()
    {
        super();

        this._udpServer = dgram.createSocket('udp4');
        this._udpServer.on('message', function (msg)
        {
            let j = 0;
            for (let i = 0;i <=msg.length;i++)
            {
                if (msg[i] == dtu[1].msgEnd[0] && msg[i+1] == dtu[1].msgEnd[1]) {
                    let data = msg.slice(j, i+2);
                    j = i+2;
                    let sensorId = this.getSensorId(data);
                    console.log(`${sensorId}: recv %s(%d bytes) `, data, data.length);
                    this.emit(`${sensorId}:data`, {id: sensorId, msg: data});
                }
            }
        }.bind(this));

        this._udpServer.on('error', function (err)
        {
            console.log('error, msg - %s, stack - %s', err.message, err.stack);
        }.bind(this));

        this._udpServer.on('listening', function ()
        {
            console.log('udp server is listening on port ' + dtu[1].port);
        }.bind(this));

        this._udpServer.bind(dtu[1].port);

        this._udpServerPort5682 = dgram.createSocket('udp4');  //腐蚀传感器数据发送至5682端口
        this._udpServerPort5682.on('message', function (msg)
        {
            let sensorId = this.getSensorIdcorrosion(msg);
            let data = this.getSensorValue(msg);
            console.log(`${sensorId}: recv %s(%d bytes) `, data, data.length);
            this.emit(`${sensorId}:data`, {id: sensorId, msg: data});
        }.bind(this));

        this._udpServerPort5682.on('error', function (err)
        {
            console.log('error, msg - %s, stack - %s', err.message, err.stack);
        }.bind(this));

        this._udpServerPort5682.on('listening', function ()
        {
            console.log('udp server is listening on port ' + dtu[0].port);
        }.bind(this));

        this._udpServerPort5682.bind(6000);//dtu[0].port

        //裂缝传感器数据发送至6060端口
        this._udpServerPort6060 = dgram.createSocket('udp4');
        this._udpServerPort6060.on('message', function (msg)
        {
            for (let i = 0;i <=msg.length;i++)
            {
                if (msg[i] == dtu[4].msgStart[0] && msg[i+1] == dtu[4].msgStart[1]) {
                    let dataTotal = msg.slice(i, i+136);
                    for(let j = 0;j < 30;j++){
                        let sensorId = dtu[4].sensorId[j];
                        let data = dataTotal.slice(7+4*j, 11+4*j);
                        this.emit(`${sensorId}:data`, {id: sensorId, msg: data});
                    }
                }
            }
        }.bind(this));

        this._udpServerPort6060.on('error', function (err)
        {
            console.log('error, msg - %s, stack - %s', err.message, err.stack);
        }.bind(this));

        this._udpServerPort6060.on('listening', function ()
        {
            console.log('udp server is listening on port ' + dtu[4].port);
        }.bind(this));

        this._udpServerPort6060.bind(dtu[4].port);
    }

    getSensorId(message)
    {
        return message.slice(1, 5);
    }

    getSensorIdcorrosion(message)
    {
        return message.slice(0, 4);
    }

    getSensorValue(message)
    {
        return message.slice(20, 36);//获取腐蚀的平均值和最大值
    }

}

export default new ServerSocket();
