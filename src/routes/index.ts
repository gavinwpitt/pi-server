import { Router } from "express";
import { getCurrentWeather, getShortTermWeather, getLongTermWeather } from "../controllers/weather";

const router: Router = Router();

router.get("/getCurrentRoomWeather", getCurrentWeather);

router.get("/getShortTermRoomWeather", getShortTermWeather);

router.get("/getLongTermRoomWeather", getLongTermWeather);

export default router;