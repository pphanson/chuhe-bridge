import logger from "winston";
import net from "net";
import events from "events";

class serverTcp extends events.EventEmitter
{
    constructor()
    {
        super();
        let HOST = '127.0.0.1';
        let PORT = 9011;
        this._tcpServer = net.createServer();
        this._tcpServer.listen(PORT, HOST);
        console.log('Server listening on port 9011.');
        this._tcpServer.on('connection', function(sock) {
            // 为这个socket实例添加一个"data"事件处理函数
            sock.on('data', function(data) {
                console.log('DATA ' + sock.remoteAddress + ': ' + data);
                // 回发该数据，客户端将收到来自服务端的数据
                let sensorId = data.slice(1, 5);
                console.log(`${sensorId}: recv %s(%d bytes) `, data, data.length);
                this.emit(`${sensorId}:data`, {id: sensorId, data: data});
            }.bind(this));
        });
    }
}

export default new serverTcp();
