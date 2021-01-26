import BME280 from "../lib/GPIO/BME280";
import WeatherSensorReadingType from "../types/WeatherSensorReadingType";
import MySqlWeatherObject from "../types/MySqlWeatherObject";
import MySqlWrapper from "../lib/MySqlWrapper";

const period:number = 1000 * 60;        // One minute
const objectLimit:number = 1 * 60 * 24; // Log every minute for 24 hrs? Seems like overkill

class WeatherCollector {
    private bme280:BME280;
    private weatherObjects:WeatherSensorReadingType[];
    private mySqlInstance:MySqlWrapper;

    constructor(mySqlInstance:MySqlWrapper) {
        this.weatherObjects = [];
        this.mySqlInstance = mySqlInstance;
        this.bme280 = new BME280();
    }

    public async setup() {
        await this.bme280.setup();
        await this.startPeriodicCollection();
    }

    private async startPeriodicCollection() {
        // Get first initial read
        this.weatherObjects.push(await this.getSensorRead())

        // Set up periodic reads
        setInterval(async () => {
            if (this.weatherObjects.push(await this.getSensorRead()) > objectLimit) {
                this.weatherObjects.shift();
            };
        }, period)
    }

    public async getSensorRead() : Promise<WeatherSensorReadingType> {
        return await this.bme280.readSensorData();
    }

    public getWeatherObjectsFromMemory() : WeatherSensorReadingType[] {
        return this.weatherObjects;
    }

    public async getWeatherObjectsFromDb() : Promise<MySqlWeatherObject[]> {
        return await this.mySqlInstance.getAllWeatherObjects();
    }
}

export default WeatherCollector;