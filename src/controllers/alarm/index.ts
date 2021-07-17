import { Response, Request } from "express";
import Alarm from "../../models/Alarm";

type alarmConstructor = {
    active:boolean,
    time:Date,
    recurring:boolean,
    weekdays:boolean,
    weekends:boolean,
    useLights:boolean,
    useSpotify:boolean,
    spotifyConfig:any
}

const GetAlarms = async (req: Request, res: Response) : Promise<void> => {
    try {
        let data = Alarm.GetActiveAlarms();

        res.status(200)
        res.json(data);
    } catch (err) {
        console.log("ERROR - ", err);
        res.status(500).json(err);
    }
}

const CreateAlarm = async (req: Request, res: Response) : Promise<void> => {
    try {
        let alarmReq:alarmConstructor = req.body;
        console.log(alarmReq);
        let alarm = new Alarm(
            alarmReq.active,
            new Date(alarmReq.time),
            alarmReq.recurring,
            alarmReq.weekdays,
            alarmReq.weekends,
            alarmReq.useLights,
            alarmReq.useSpotify,
            alarmReq.spotifyConfig
        );

        res.status(200);
        res.json(alarm);
    } catch (err) {
        console.log("ERROR - ", err);
        res.status(500).json(err);
    }
}

export { GetAlarms, CreateAlarm }