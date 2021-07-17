import { CronJob } from 'cron';
import { Guid } from 'guid-typescript';
import MySqlWrapper from "../lib/MySqlWrapper";
import SpotifyApiWrapper from "../lib/SpotifyApiWrapper";

type spotifyConfig = {
    deviceId: string,
    uri:string,
    volume:number,
    shuffle:boolean
}

class Alarm {
    public alarmId:Guid;
    // Time and Day related fields
    public active:boolean = false;
    public time?:Date;
    public recurring:boolean = false;
    public weekdays:boolean = false;
    public weekends:boolean = false;
    // Wake up methods
    public useLights:boolean = false;
    public useSpotify:boolean = false;
    public spotifyConfig:spotifyConfig | null = null;
    
    // private job:CronJob | null = null;

    // Helpful stuff
    private static Weekdays:number[] = [1,2,3,4,5]
    private static Weekends:number[] = [0,6]

    // TODO: Read/Write alarms to a table
    private static mySqlInstance:MySqlWrapper;
    private static spotifyWrapper:SpotifyApiWrapper;
    // Keyed off of alarmId (GUID)
    private static activeAlarms: Record<string, Alarm> = {};
    private static activeJobs: Record<string, CronJob> = {};

    public static SetMySqlInstance(mySqlInstance:MySqlWrapper) {
        Alarm.mySqlInstance = mySqlInstance;
    }

    public static SetSpotifyWrapper(spotifyWrapper:SpotifyApiWrapper) {
        Alarm.spotifyWrapper = spotifyWrapper;
    }

    public static GetActiveAlarms() {
        return Object.keys(Alarm.activeJobs);
    }

    constructor (
        active:boolean,
        time:Date,
        recurring:boolean,
        weekdays:boolean,
        weekends:boolean,
        useLights:boolean,
        useSpotify:boolean,
        spotifyConfig:spotifyConfig) {
            // Construct the useful stuff
            this.alarmId = Guid.create();
            this.active = active;
            this.time = time;
            this.recurring = recurring;
            this.weekdays = weekdays;
            this.weekends = weekends;
            this.useLights = useLights;
            this.useSpotify = useSpotify;
            this.spotifyConfig = spotifyConfig ?? null;
            
            if (this.active)
                this.createAlarmCronJob();
    }

    public activate() {
        this.active = true;
        this.createAlarmCronJob();
    }

    private createAlarmCronJob() {
        let job = new CronJob(this.getCronStr(), async () => {
            console.log("Executing Alarm at " + new Date().toLocaleString());
            await this.executeAlarm();
            console.log("Executed Alarm at " + new Date().toLocaleString());
        });

        // Start Job
        console.log("Starting Job");
        job.start();
        // Add Job to Running Jobs list
        console.log("Adding job to memory of active alarms");
        Alarm.activeJobs[this.alarmId.toString()] = job;
        Alarm.activeAlarms[this.alarmId.toString()] = this;
    }

    private async executeAlarm() {
        // TODO: This is really only logically set up for one device
        if (this.useSpotify) {
            // Need to turn on device
            // Check if device is active. If not then
            // use GPIO to turn on television x amount of Mins prior

            // Play on device
            await Alarm.spotifyWrapper.playOnDevice(
                this.spotifyConfig?.deviceId || "",
                this.spotifyConfig?.uri || "",
                this.spotifyConfig?.shuffle,
                true,
                this.spotifyConfig?.volume
            )
        }
    }

    private getCronStr() {
        if (!this.time)
            throw new Error("Time param not defined!");

        let min:number = this.time?.getMinutes();
        let hour:number = this.time?.getHours();
        let days:number[] = [];
        // Everyday by default?
        let dayStr = "*";

        if (this.weekdays) {
            console.log("Concat " + Alarm.Weekdays);
            days = days.concat(Alarm.Weekdays);
        }
        if (this.weekends) {
            console.log("Concat " + Alarm.Weekends);
            days = days.concat(Alarm.Weekends);
        }

        console.log("DAYS" + days);
        dayStr = days.join(",");

        console.log(`${min} ${hour} * * ${dayStr}`);
        return `${min} ${hour} * * ${dayStr}`;
    }

    toJson() {
        return {
            alarmId: this.alarmId,
            active: this.active,
            time: this.time,
            recurring: this.recurring,
            weekdays: this.weekdays,
            weekends: this.weekends,
            useLights: this.useLights,
            useSpotify: this.useSpotify,
            spotifyConfig: {
                deviceId: this.spotifyConfig?.deviceId,
                uri: this.spotifyConfig?.uri,
                volume: this.spotifyConfig?.volume,
                shuffle: this.spotifyConfig?.shuffle
            }
        }
    }
}

export default Alarm;