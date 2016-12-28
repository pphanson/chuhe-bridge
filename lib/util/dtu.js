export default [
    {
        id:"01",
        type: "udp",
        port:"5682",
        sensorTypes:["08"]
    },
    {
        id:"02",
        type: "udp",
        port:"5683",
        sensorTypes:["01","03","05","06","07","09"]
    },
    {
        id:"03",
        type: "tcp",
        ip: "127.0.0.1",
        port:"9011",
        sensorTypes:["02","04"],
        msgHeader:58,
        msgLength:27

    }
];