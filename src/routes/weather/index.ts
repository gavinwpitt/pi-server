import { Router } from "express";
import { getCurrentWeather, getShortTermWeather, getLongTermWeather } from "../../controllers/weather";

const weatherRouter: Router = Router();

const basePath: string = "weather";

weatherRouter.get(`/${basePath}/getCurrentRoomWeather`, getCurrentWeather);

weatherRouter.get(`/${basePath}/getShortTermRoomWeather`, getShortTermWeather);

weatherRouter.get(`/${basePath}/getLongTermRoomWeather`, getLongTermWeather);

export default weatherRouter;