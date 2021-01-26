type MySqlWeatherObject = {
    Location:string,
    Temperature: number,
    Humidity: number,
    Pressure: number,
    WindSpeed: number,
    WindDirection: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW",
    DateTimeStamp: Date
}

export default MySqlWeatherObject;