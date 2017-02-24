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
        let sensorID;
        let channelId = parseInt((message.slice(5,7)).toString());
        if (channelId > 32)
        {
            let sensortype = new Buffer ([0x30,0x32]);
            let id = (channelId - 32).toString();
            let msgid;
            if (id.length >= 2) {
                msgid = new Buffer(id, 'ascii');
            }else {

                msgid = new Buffer(("0"+id), 'ascii');
            }

            let list =  [sensortype,msgid];
            sensorID = Buffer.concat(list);
        }else{
            let sensortype = new Buffer ([0x30,0x34]);
            let list =  [sensortype,message.slice(5, 7)];
            sensorID = Buffer.concat(list);
        }
        return sensorID;
    }

}

export default new tcpServerSocket();
