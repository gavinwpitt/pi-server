import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import weatherRoutes from "./routes/weather";
import rfremoteRoutes from "./routes/rfremote";
import WeatherCollector from "./models/WeatherCollector";
import RfRemote from "./models/RfRemote";
import MySqlWrapper from "./lib/MySqlWrapper";

dotenv.config();

const app: Express = module.exports = express()

const PORT: string | number = parseInt(process.env.PORT || "") ?? 4000;


console.log(process.env.PORT);
console.log(process.env.SQL_USER)
console.log(process.env.BME280_i2cAddress);

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

app.use(express.json());
app.use(express.urlencoded());

app.use(cors())
app.use(weatherRoutes)
app.use(rfremoteRoutes)

app.listen( PORT, () => {
    console.log("server started at port " + PORT);
})