class Measurement {
    constructor(id, airTemperature, airHumidity, soilMoisture, createdAt) {
        this.id = id;
        this.airTemperature = airTemperature;
        this.airHumidity = airHumidity;
        this.soilMoisture = soilMoisture;
        this.createdAt = createdAt;
    }
}

export default Measurement;