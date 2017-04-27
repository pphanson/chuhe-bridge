export default [
    {
        id:"01",
        type: "udp",
        port:"5682",
        sensorTypes:["08"],
        msgEnd:[13,10]
    },
    {
        id:"02",
        type: "udp",
        port:"5683",
        sensorTypes:["01","03","05","06","07"],
        msgEnd:[13,10]
    },
    {
        id:"03",
        type: "tcp",
        ip: "localhost",
        port:"9011",
        sensorTypes:["02","04"],
        msgHeader:58,
        msgLength:27

    },
    {
        id:"04",
        type: "tcp",
        ip: "127.0.0.1",
        port:"6161",
        sensorTypes:["09"],
        sensorId:"0901"
    },
    {
        id:"05",
        type: "udp",
        port:"6060",
        sensorTypes:["11"],
        sensorId:["1101","1102","1103","1104","1105","1106","1107","1108","1109","1110","1111","1112","1113","1114","1115",
            "1116","1117","1118","1119","1120","1121","1122","1123","1124","1125","1126","1127","1128","1129","1130"],
        msgStart:[0xC5,0x5C]
    }
];