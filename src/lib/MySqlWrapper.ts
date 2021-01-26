import MySqlWeatherObject from "../types/MySqlWeatherObject";
import mysql from 'mysql2/promise';

class MySqlWrapper {
	private host:string;
	private user:string;
	private password:string;
	private database:string;
	private pool:any;

	private nullStr:string = "NULL";
	private weatherTableName:string = "weather";

	constructor() {
		this.host = process.env.SQL_HOST as string;
		this.user = process.env.SQL_USER as string;
		this.password = process.env.SQL_PASSWORD as string;
		this.database = process.env.SQL_DATABASE as string;
	}

	public async setup() {
		this.pool = await mysql.createPool({
			host: this.host,
			user: this.user,
			password: this.password,
			database: this.database,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0
		});
	}

	async GetMySqlDateTimeStamp(date:Date):Promise<string> {	
		var year:number 	= date.getFullYear();
		var month:string 	= await this.PrependZero(date.getMonth() + 1);
		var day:string		= await this.PrependZero(date.getDate());
	
		var hour:string 	= await this.PrependZero(date.getHours());
		var minute:string	= await this.PrependZero(date.getMinutes());
		var seconds:string	= await this.PrependZero(date.getSeconds());
		
		return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
	}

	async insertWeatherObject(weatherObj:MySqlWeatherObject) {
		// Migrated from another project... TODO: Refactor for this
		/*
		var columnValues:any[] = [
			weatherObj.Location										?? this.nullStr,
			weatherObj.Temperature 									?? this.nullStr,
			weatherObj.Humidity										?? this.nullStr,
			weatherObj.WindSpeed									?? this.nullStr,
			weatherObj.WindDirection								?? this.nullStr,
			this.GetMySqlDateTimeStamp(weatherObj.DateTimeStamp)	?? this.nullStr
		];

		let insertStr:string = `INSERT INTO ${this.weatherTableName} (${weatherColumns.toString()}) VALUES (${columnValues.toString()})`;
		await await this.pool.query(insertStr);
		*/
	}


	async getAllWeatherObjects() : Promise<MySqlWeatherObject[]> {
		const sql = "SELECT * FROM weather;";
		
		let results = await this.pool.query(sql);

		let resultTransform:MySqlWeatherObject[] = results[0]
		
		return results[0]
	}
	private async PrependZero(intVal:number): Promise<string> {
		return ('0' + intVal).slice(-2);
	}
}

export default MySqlWrapper;