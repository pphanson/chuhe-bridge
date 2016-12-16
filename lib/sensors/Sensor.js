import events from "events";
import express from "express";
import logger from "winston";
import io from '../server/io';
import mongodb from "mongodb";

export default class Sensor extends events.EventEmitter
{
    constructor(config)
    {
        super();
        console.log("fuck");
        this._config = config;
        this._id = config.id;
        this._name = config.name;
        this._meta = config.meta;
        this._storage = null;


        this._value = {};
        this._lastUpdatedTime = null;

        this.initRouter();
    }

    initRouter()
    {
        this._router = express.Router();
        this._router.get("/", this._get_handler.bind(this));
        this._router.get("/value", this._value_get_handler.bind(this));
        this._router.get("/data", this._data_get_handler.bind(this));

        this._nsp = io.of("/api/sensor/" + this._id);
        this._nsp.on("connection", function(socket){
            console.log("room: " + this._id + 'is connected');
        }.bind(this));
    }


    get id()
    {
        return this._id;
    }

    get name()
    {
        return this._name;
    }

    get config()
    {
        return this._config;
    }

    get meta()
    {
        return this._meta;
    }

    get storage()
    {
        return this._storage;
    }

    get router()
    {
        return this._router;
    }

    get lastUpdatedTime()
    {
        return this._lastUpdatedTime;
    }


    get value()
    {
        return this._value;
    }
    async setValue(value)
    {
        this._lastUpdatedTime = new Date();
        if (JSON.stringify(value) !== JSON.stringify(this._value))
        {
            this._value = value;
            console.log('socket send');
            this._nsp.emit('value', {
                value: _clone(this.value),
                lastUpdatedTime: this._lastUpdatedTime
            });
            const from = new Date(
              this._lastUpdatedTime.getFullYear(),
              this._lastUpdatedTime.getMonth(),
              this._lastUpdatedTime.getDate()
            );
            const stats = await this.storage.queryStats(from, this._lastUpdatedTime);
            this._nsp.emit('stats', {
                ...stats,
                lastUpdatedTime: this._lastUpdatedTime
            });

            this.emit("valueChanged");
        }
        this.emit("updated");
        logger.info(`- [${this.id}] ${JSON.stringify(this.value)}`);
    }

    async  alarmHandler(value)
    {
        let alarmLever = 0;
        let alarm = {};

        for (let key in this.meta.values) {
            if (key) {
                if (value[key] >= this.config.alarm[key].hhup || value[key] <= this.config.alarm[key].hhdown) {
                    alarmLever = 1;
                }
                else if (value[key] >= this.config.alarm[key].mmup || value[key] <= this.config.alarm[key].mmdown) {
                    alarmLever = 2;
                }
                else if (value[key] >= this.config.alarm[key].llup || value[key] <= this.config.alarm[key].lldown) {
                    alarmLever = 3;
                }
                alarm[key] = alarmLever;
                if (alarmLever > 0)
                {
                    this._nsp.emit('alarm', {
                        value: _clone(this.value),
                        level: alarmLevel,
                        lastUpdatedTime: this._lastUpdatedTime
                    });
                    let doc = {
                        timestamp: this._lastUpdatedTime *1,
                        sensor_id: this.config.id,
                        alarm_obj: key,
                        alarm_type: '数值报警',
                        alarm_lever: alarmLever,
                        alarm_value: value[key],
                        alarm_content:'数值异常'
                    };
                    let connect = await mongodb.MongoClient.connect('mongodb://localhost:27017/zhixingdb_chuhedq');
                    let collection = connect.collection('alarm');
                    collection.insertOne(doc);
                }
            }
        }
    }

        _get_handler(req, res)
    {
        res.send({
            id: this.id,
            name: this.name,
            desc: this.desc,
            meta: this.meta,
            monitor: this.config.monitor,
            storage: this.config.storage,
        });
    }

    _value_get_handler(req, res)
    {
        const value = _clone(this.value);
        value.lastUpdatedTime = this.lastUpdatedTime;
        res.send(value);
    }

    async _data_get_handler(req, res)
    {
        if (req.query.time)
        {
            const timeString = req.query.time;
            const time = new Date(timeString);
            if (isNaN(time))
            {
                res.send(`Parameters "time" is not a valid date time format.`);
                res.status(422).end();
                return;
            }

            let data = null;
            try
            {
                data = await this.storage.queryOne(time);
            }
            catch (err)
            {
                logger.error(err);
                res.status(500).end(err.message);
                return;
            }
            res.send(data);
        }
        else if (req.query.from)
        {

            const from = req.query.from;
            const to = req.query.to;
            if (!to)
            {
                res.status(422).end(`Parameters "to" are required.`);
                return;
            }
            const fromTime = new Date(from);
            if (isNaN(fromTime))
            {
                res.status(422).end(`Parameters "from" is not a valid date time format.`);
                return;
            }
            const toTime = new Date(to);
            if (isNaN(toTime))
            {
                res.status(422).end(`Parameters "to" is not a valid date time format.`);
                return;
            }

            let data = null;
            try
            {
                data = await this.storage.query(fromTime, toTime);
            }
            catch (err)
            {
                logger.error(err);
                res.status(500).end(err.message);
                return;
            }
            res.send(data);
        }
        else
        {
            res.status(422).end(`Query parameters required. e.g. "time", "from" + "to"`);
        }
    }
}


function _clone(obj)
{
    return JSON.parse(JSON.stringify(obj));
}



