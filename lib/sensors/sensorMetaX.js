/**
 * Created by 54574_000 on 2016/12/9.
 */
export default class SensorMeta {
    constructor(config) {
        this._id = config._id;
        this._name = config.name;
        this._interval = config.monitor.interval;
        this._hhup = config.alarm.hhup;
        this._hhdown = config.alarm.hhdown;
        this._values = config.values;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get sensorInterval() {
        return this._interval;
    }
    get sensorHhup() {
        return this._hhup;
    }
    get sensorHhdown() {
        return this._hhdown;
    }
    get values() {
        return this._values;
    }
}
