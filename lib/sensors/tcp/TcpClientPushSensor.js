/**
 * Created by 27769 on 2017/4/15.
 */

import logger from "winston";
import gbk from "liveinjs-gbk";
import {
    Double
} from "mongodb";
import net from "net";
import dtu from "../../util/dtu.js";
import Sensor from "../Sensor";

export default class TcpClientPushSensor extends Sensor {
    constructor(config) {
        super(config);
        this.initMonitor();
    }

    initRouter() {
        super.initRouter();
    }

    initMonitor() {
        let method = this;
        net.createServer(function(sock) {

            // 我们获得一个连接 - 该连接自动关联一个socket对象
            console.log('CONNECTED: ' +
                sock.remoteAddress + ':' + sock.remotePort);
            let values;
            // 为这个socket实例添加一个"data"事件处理函数
            sock.on('data', function(data) {
                console.log('DATA ' + sock.remoteAddress + ': ' + data);
                // 回发该数据，客户端将收到来自服务端的数据
                let sensorId = dtu[3].sensorId;
                // let value = this.format(data);
                console.log(data);
                var idStr = (data.slice(3,19)).toString('utf8');
                var idArray = [];
                for (var i = 0; i < idStr.length; i += 2) {
                    var temp = parseInt(idStr[i] + idStr[i + 1], 16);
                    idArray[i / 2] = temp;
                }
                let ids = new Buffer(idArray);
                var idstr = ids.toString();


                let str = (data.slice(35,45)).toString('utf8');
                let licenseplateArray = [];
                for (let i = 0; i < str.length; i += 2) {
                    let temp = parseInt(str[i] + str[i + 1], 16);
                    licenseplateArray[i / 2] = temp;
                }
                let s = new Buffer(licenseplateArray);
                let licenseplateStr = gbk.deGBK(s);

                values = {
                    "datalength": (data.slice(2,3)).readUInt8(),
                    "id":((data.slice(3,19)).readUInt8()).toString(),
                    "lane":(data.slice(34,35)).readUInt8(),
                    "licenseplate":((data.slice(35,45)).readUInt8()).toString(),
                    "axesnumber": (data.slice(45,46)).readUInt8(),
                    "weight":(data.slice(46,48)).readUInt16BE(),
                    "time":(data.slice(48,50)).readUInt16BE(),
                    "weightlimit": (data.slice(55,57)).readUInt16BE(),
                    "overweight":(data.slice(57,59)).readUInt16BE(),
                    "axesweight1":(data.slice(59,61)).readUInt16BE(),
                    "axesweight2":(data.slice(61,63)).readUInt16BE(),
                    "axesweight3":(data.slice(63,65)).readUInt16BE(),
                    "axesweight4":(data.slice(65,67)).readUInt16BE(),
                    "axesweight5": (data.slice(67,69)).readUInt16BE(),
                    "axesweight6":(data.slice(69,71)).readUInt16BE(),
                    "axesweight7":(data.slice(71,73)).readUInt16BE(),
                    "axesweight8": (data.slice(73,75)).readUInt16BE(),
                    "axesvelocity1":(data.slice(75,76)).readUInt8(),
                    "axesvelocity2":(data.slice(76,77)).readUInt8(),
                    "axesvelocity3": (data.slice(77,78)).readUInt8(),
                    "axesvelocity4":(data.slice(78,79)).readUInt8(),
                    "axesvelocity5":(data.slice(79,80)).readUInt8(),
                    "axesvelocity6": (data.slice(80,81)).readUInt8(),
                    "axesvelocity7":(data.slice(81,82)).readUInt8(),
                    "axesvelocity8":(data.slice(82,83)).readUInt8(),
                    "shaftspacing12": (data.slice(83,85)).readUInt16BE(),
                    "shaftspacing23":(data.slice(85,87)).readUInt16BE(),
                    "shaftspacing34":(data.slice(87,89)).readUInt16BE(),
                    "shaftspacing45":(data.slice(89,91)).readUInt16BE(),
                    "shaftspacing56":(data.slice(91,93)).readUInt16BE(),
                    "shaftspacing67":(data.slice(93,95)).readUInt16BE(),
                    "shaftspacing78": (data.slice(95,97)).readUInt16BE(),
                    "totalwheelbase":(data.slice(97,99)).readUInt16BE(),
                    "carlength":(data.slice(99,101)).readUInt16BE(),
                    "fronthanginglong": (data.slice(101,103)).readUInt16BE(),
                    "afterhanginglong":(data.slice(103,105)).readUInt16BE(),
                    "vehiclespacing":(data.slice(105,107)).readUInt16BE(),
                    "direction": (data.slice(107,108)).readUInt8(),
                    "vehicletype":(data.slice(108,110)).readUInt16BE(),
                    "violationtype":(data.slice(110,111)).readUInt8(),
                    "temperature": (data.slice(111,112)).readUInt8(),
                    "correctnesstype":(data.slice(112,113)).readUInt8(),
                    "vehiclespacingtime":(data.slice(113,115)).readUInt16BE(),
                    "axesgroupweight1": (data.slice(115,117)).readUInt16BE(),
                    "axesgroupweight2":(data.slice(117,119)).readUInt16BE(),
                    "axesgroupweight3":(data.slice(119,121)).readUInt16BE(),
                    "axesgroupweight4": (data.slice(121,123)).readUInt16BE(),
                    "axesgroupweight5":(data.slice(123,125)).readUInt16BE(),
                    "axesgroupweight6":(data.slice(125,127)).readUInt16BE(),
                    "axesgroupweight7": (data.slice(127,129)).readUInt16BE(),
                    "axesgroupweight8":(data.slice(129,131)).readUInt16BE(),
                    "axesequivalentload1":(data.slice(131,133)).readUInt16BE(),
                    "axesequivalentload2": (data.slice(133,135)).readUInt16BE(),
                    "axesequivalentload3":(data.slice(135,137)).readUInt16BE(),
                    "axesequivalentload4":(data.slice(137,139)).readUInt16BE(),
                    "axesequivalentload5": (data.slice(139,141)).readUInt16BE(),
                    "axesequivalentload6":(data.slice(141,143)).readUInt16BE(),
                    "axesequivalentload7":(data.slice(143,145)).readUInt16BE(),
                    "axesequivalentload8": (data.slice(145,147)).readUInt16BE(),
                    "passingtime":(data.slice(147,149)).readUInt16BE(),
                    "acrosstag":(data.slice(151,152)).readUInt8()
                };
                console.log(values);
                if (values !== null && values !== undefined)
                {
                    method.setValue(values);
                    method.alarmHandler(values);
                }
                // this.emit(`${sensorId}:data`, {id: sensorId, data: data});
                // 回发ACK信息
                let ackdata = new Buffer ([0xff,0x02,0x0a,0x00,0x00,0x00,0x00,0x00,0x00,0x0a]);
                sock.write(ackdata);
            }.bind(this));

            // 为这个socket实例添加一个"close"事件处理函数
            sock.on('close', function(data) {
                console.log('CLOSED: ' +
                    sock.remoteAddress + ' ' + sock.remotePort);
            });

        }).listen(dtu[3].port, dtu[3].ip);
    }
}

