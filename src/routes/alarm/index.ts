import { Router } from "express";
import { GetAlarms, CreateAlarm } from "../../controllers/alarm";

const alarmRouter: Router = Router();

const basePath: string = "alarm";

alarmRouter.get(`/${basePath}/`, GetAlarms);

alarmRouter.post(`/${basePath}/create`, CreateAlarm);

export default alarmRouter;