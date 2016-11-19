import logger from "winston";
import dgram from "dgram";
import events from "events";

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
            console.log('udp server is listening on port 5683.');
        }.bind(this))

        this._udpServer.bind(5683);
    }

    getSensorId(message)
    {
        return message.slice(1, 5);
    }
}

export default new ServerSocket();
