export default class SensorMeta {

  constructor(config) {
      this._id = config._id;
      this._sensortype = config.id;
      this._name = config.name;
      this._desc = config.desc;
      this._model = config.model;
      this._monitor = config.monitor;
      this._values = config.values;
      this._monitor = config.monitor;
      this._alarm = config.alarm;
  }


  get id() {
      return this._id;
  }
    get monitor(){
        return this._monitor;
    }

  get sensortype() {
      return this._sensortype;
  }

  get name()
  {
      return this._name;
  }

  get desc()
  {
      return this._desc;
  }

  get model()
  {
      return this._model;
  }
  get monitor()
  {
      return this._monitor;
  }

  get values()
  {
      return this._values;
  }

  get alarm()
  {
      return this._alarm;
  }


}
