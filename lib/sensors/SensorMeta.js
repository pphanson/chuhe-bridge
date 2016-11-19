export default class SensorMeta {

  constructor(config) {
      this._id = config._id;
      this._name = config.name;
      this._desc = config.desc;
      this._model = config.model;
      this._values = config.values;
  }


  get id() {
      return this._id;
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

  get values()
  {
      return this._values;
  }
}
