/**
 * Created by 54574_000 on 2016/12/9.
 */
export default class SensorInstance {
    constructor(config) {
        this._sensorMetaId = config.meta.oid;
        this._collectionName = config.storage.collection.name;
    }
    get sensorMetaId() {
        return this._sensorMetaId;
    }
    get collectionName() {
        return this._collectionName;
    }
}
