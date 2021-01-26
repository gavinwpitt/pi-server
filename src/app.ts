import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import tempRoutes from "./routes";
import WeatherCollector from "./models/WeatherCollector";
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

// Create and set the weather collector
let weatherCollector:WeatherCollector = new WeatherCollector(mySqlInstance);
weatherCollector.setup();
app.set('weatherCollector', weatherCollector);

app.use(cors())
app.use(tempRoutes)

app.listen( PORT, () => {
    console.log("server started at port " + PORT);
})