import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import weatherRoutes from "./routes/weather";
import rfremoteRoutes from "./routes/rfremote";
import spotifyRoutes from "./routes/spotify";
import alarmRoutes from "./routes/alarm";
import WeatherCollector from "./models/WeatherCollector";
import RfRemote from "./models/RfRemote";
import Alarm from "./models/Alarm";
import MySqlWrapper from "./lib/MySqlWrapper";
import SpotifyApiWrapper from "./lib/SpotifyApiWrapper";

dotenv.config();

const app: Express = module.exports = express()

const PORT: string | number = parseInt(process.env.PORT || "") ?? 4000;


console.log(process.env.PORT);
console.log(process.env.SQL_USER)
console.log(process.env.BME280_i2cAddress);
console.log(process.env.SPOTIFY_CLIENT_ID);
console.log(process.env.SPOTIFY_SECRET_KEY);

// Create and set up MySql instance
let mySqlInstance:MySqlWrapper = new MySqlWrapper();
mySqlInstance.setup();
app.set('mySqlInstance', mySqlInstance);

// Create RF remote
let rfremote:RfRemote = new RfRemote();
app.set('rfRemote', rfremote);

// Create and set the weather collector
let weatherCollector:WeatherCollector = new WeatherCollector(mySqlInstance, rfremote);
weatherCollector.setup();
app.set('weatherCollector', weatherCollector);

// Set up Spotify
let spotifyApiWrapper = new SpotifyApiWrapper(process.env.SPOTIFY_CLIENT_ID || "", process.env.SPOTIFY_SECRET_KEY || "");
app.set('spotifyApiWrapper', spotifyApiWrapper);

Alarm.SetMySqlInstance(mySqlInstance);
Alarm.SetSpotifyWrapper(spotifyApiWrapper);

app.use(express.json());
app.use(express.urlencoded());

app.use(cors())
app.use(weatherRoutes)
app.use(rfremoteRoutes)
app.use(spotifyRoutes);
app.use(alarmRoutes);

app.listen( PORT, () => {
    console.log("server started at port " + PORT);
})