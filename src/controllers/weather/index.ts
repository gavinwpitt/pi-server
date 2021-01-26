import { Response, Request } from "express"
import WeatherSensorReadingType from "../../types/WeatherSensorReadingType";
import MySqlWeatherObject from "../../types/MySqlWeatherObject";

const getCurrentWeather = async (req: Request, res: Response) : Promise<void> => {
    try {
        let weatherCollector = await req.app.get('weatherCollector');
        let sensorRead:WeatherSensorReadingType = await weatherCollector.getSensorRead();
        res.type('json');
        res.status(200).json(sensorRead);
    } catch (err) {
        throw err;
    }
}

const getShortTermWeather = async (req: Request, res: Response) : Promise<void> => {
    try {
        let weatherCollector = await req.app.get('weatherCollector');
        let getWeatherObjects:WeatherSensorReadingType[] = await weatherCollector.getWeatherObjectsFromMemory();
        res.type('json');
        res.status(200).json(getWeatherObjects);
    } catch (err) {
        throw err;
    }
}

const getLongTermWeather = async (req: Request, res: Response) : Promise<void> => {
    try {
        let weatherCollector = await req.app.get('weatherCollector');
        let getWeatherObjects:MySqlWeatherObject[] = await weatherCollector.getWeatherObjectsFromDb();
        res.type('json');
        res.status(200).json(getWeatherObjects);
    } catch (err) {
        throw err;
    }
}

export { getCurrentWeather, getShortTermWeather, getLongTermWeather }