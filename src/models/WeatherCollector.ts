import BME280 from "../lib/GPIO/BME280";
import WeatherSensorReadingType from "../types/WeatherSensorReadingType";
import MySqlWeatherObject from "../types/MySqlWeatherObject";
import SpaceHeaterThresholdsType from "../types/SpaceHeaterThresholdsType";
import MySqlWrapper from "../lib/MySqlWrapper";
import RfRemote from "./RfRemote";

const period:number = 1000 * 60;        // One minute
const objectLimit:number = 1 * 60 * 24; // Log every minute for 24 hrs? Seems like overkill

class WeatherCollector {
    private bme280:BME280;
    private weatherObjects:WeatherSensorReadingType[];
    private mySqlInstance:MySqlWrapper;
    private rfRemote:RfRemote;

    // space heater settings
    private spaceHeaterSwitchNumber:number;
    private tempThresholds:SpaceHeaterThresholdsType;

    constructor(mySqlInstance:MySqlWrapper, rfRemote:RfRemote) {
        this.weatherObjects = [];
        this.mySqlInstance = mySqlInstance;
        this.bme280 = new BME280();

        // space heater stuff
        this.rfRemote = rfRemote;
        this.spaceHeaterSwitchNumber = 1;
        this.tempThresholds = { lowerThreshold: 60, upperThreshold: 65 }
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
            let sensorRead = await this.getSensorRead();
            if (this.weatherObjects.push(sensorRead) > objectLimit) {
                this.weatherObjects.shift();
            };

            // TODO: Clean this up, move it somewhere else maybe
            // If temperature falls below a certain level, turn on the space heater :)
            if (sensorRead.Temperature < this.tempThresholds.lowerThreshold) {
                await this.rfRemote.switch(true, [ this.spaceHeaterSwitchNumber ]);
            }
            
            // If temperature rises above a certain level, turn off the space heater
            if (sensorRead.Temperature > this.tempThresholds.upperThreshold) {
                await this.rfRemote.switch(false, [ this.spaceHeaterSwitchNumber ]);
            }
            
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

    public getSpaceHeaterThresholds() : SpaceHeaterThresholdsType {
        return this.tempThresholds;
    }

    public adjustSpaceHeaterThresholds(newThresholds:SpaceHeaterThresholdsType) {
        this.tempThresholds.lowerThreshold = newThresholds.lowerThreshold;
        this.tempThresholds.upperThreshold = newThresholds.upperThreshold;
    }
}

export default WeatherCollector;