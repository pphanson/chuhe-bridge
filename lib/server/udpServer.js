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
            if(msg.length >= 16)
            {
                let sensorId = this.getSensorId(msg);
                let sensorvalue = this.getSensorValue(msg);  //传感器值float转ASCII
                let list = [msg.slice(0,7),sensorvalue,msg.slice(15,16)];
                msg = Buffer.concat(list);
                console.log(`${sensorId}: recv %s(%d bytes) `, msg, msg.length);
                this.emit(`${sensorId}:data`, {id: sensorId, msg: msg});
            }
        }.bind(this));

        this._udpServerPort5682.on('error', function (err)
        {
            console.log('error, msg - %s, stack - %s', err.message, err.stack);
        }.bind(this));

        this._udpServerPort5682.on('listening', function ()
        {
            console.log('udp server is listening on port ' + dtu[0].port);
        }.bind(this));

        this._udpServerPort5682.bind(5682);

        // this._udpServerPort5681 = dgram.createSocket('udp4');  //称重系统数据发送至5681端口
        // this._udpServerPort5681.on('message', function (msg)
        // {
        //     let sensorId = dtu[3].sensorId;
        //     console.log(`${sensorId}: recv %s(%d bytes) `, msg, msg.length);
        //     this.emit(`${sensorId}:data`, {id: sensorId, msg: msg});
        // }.bind(this));
        //
        // this._udpServerPort5681.on('error', function (err)
        // {
        //     console.log('error, msg - %s, stack - %s', err.message, err.stack);
        // }.bind(this));
        //
        // this._udpServerPort5681.on('listening', function ()
        // {
        //     console.log('udp server is listening on port ' + '5685s');
        // }.bind(this));
        //
        // this._udpServerPort5681.bind(5685);
    }

    getSensorId(message)
    {
        return message.slice(1, 5);
    }

    getSensorValue(message)
    {
        let RRatio =  message.slice(7,11);
        let RRefer =  message.slice(11,15);
        let RRatioFloat = (RRatio.readFloatBE()).toString();
        let RReferFloat = (RRefer.readFloatBE()).toString();
        let RRatiovalue = new Buffer(RRatioFloat, 'ascii');
        let RRefervalue = new Buffer(RReferFloat, 'ascii');
        let RRatioName = new Buffer ('A', 'ascii');
        let RReferName = new Buffer ('B', 'ascii');
        let list = [RRatioName,RRatiovalue,RReferName,RRefervalue];
        message = Buffer.concat(list);
        return  message;
    }

}

export default new ServerSocket();
