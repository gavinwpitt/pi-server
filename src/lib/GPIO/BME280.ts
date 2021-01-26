// @ts-ignore
import BME280 from 'bme280-sensor';
import WeatherSensorReadingType from "../../types/WeatherSensorReadingType";

type config = {
    i2cBusNo: number
    i2cAddress: any
}

class BME280Wrapper {
    private bme280:any;

    constructor() {
        this.bme280 = new BME280({
            i2cBusNo: parseInt(process.env.BME280_i2cBusNo || ''),
            i2cAddress: parseInt(process.env.BME280_i2cAddress || '')
        });
    }

    public async setup() {
        await this.bme280.init();
    }
    
    async readSensorData() :  Promise<WeatherSensorReadingType> {
        let data:any = await this.bme280.readSensorData();
        return {
            "Temperature": 	BME280.convertCelciusToFahrenheit(data.temperature_C),
            "Pressure":	BME280.convertHectopascalToInchesOfMercury(data.pressure_hPa),
            "Humidity":	data.humidity,
            "DateTime": new Date()
        }
    }
}

export default BME280Wrapper;