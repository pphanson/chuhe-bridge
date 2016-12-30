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
            let sensorId = this.getSensorId(msg);
            console.log(`${sensorId}: recv %s(%d bytes) `, msg, msg.length);
            this.emit(`${sensorId}:data`, {id: sensorId, msg: msg});
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

        this._udpServerPort5682.bind(dtu[0].port);
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
