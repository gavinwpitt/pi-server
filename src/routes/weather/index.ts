import { Router } from "express";
import { getCurrentWeather, getShortTermWeather, getLongTermWeather, getSpaceHeaterThresholds, setSpaceHeaterThresholds } from "../../controllers/weather";

const weatherRouter: Router = Router();

const basePath: string = "weather";

weatherRouter.get(`/${basePath}/getCurrentRoomWeather`, getCurrentWeather);

weatherRouter.get(`/${basePath}/getShortTermRoomWeather`, getShortTermWeather);

weatherRouter.get(`/${basePath}/getLongTermRoomWeather`, getLongTermWeather);

weatherRouter.get(`/${basePath}/getSpaceHeaterThresholds`, getSpaceHeaterThresholds);

weatherRouter.post(`/${basePath}/setSpaceHeaterThresholds`, setSpaceHeaterThresholds);

export default weatherRouter;