import logger from "winston";
import net from "net";
import events from "events";
import dtu from "../util/dtu.js";

class tcpServerSocket extends events.EventEmitter
{
    constructor()
    {
        super();
        let HOST = dtu[2].ip;
        let PORT = dtu[2].port;
        this._client = new net.Socket();

        this._client.connect(PORT, HOST, function() {
            console.log('tcp client connected to: ' + HOST + ':' + PORT);
        });

        // 为客户端添加“data”事件处理函数，data是服务器发回的数据
        this._client.on('data', function(data) {
            for (let i = 0;i <=data.length;i++ )
            {
                if (data[i] == dtu[2].msgHeader ){
                    let msg = data.slice(i, i+dtu[2].msgLength);
                    let sensorId = this.getSensorId(msg);
                    console.log(`${sensorId}: recv %s(%d bytes) `, msg, msg.length);
                    this.emit(`${sensorId}:data`, {id: sensorId, data: msg});
                }
            }
        }.bind(this));

        // 为客户端添加“close”事件处理函数
        this._client.on('close', function() {

           // console.log('Connection closed');

        });

        // 为客户端添加“error”事件处理函数,重新建立连接
        this._client.on('error', () => {

            // console.log("error");

            this._client.connect(PORT, HOST);
        });
    }

    getSensorId(message)
    {
        return message.slice(5, 9);
    }

}

export default new tcpServerSocket();
