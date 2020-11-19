const mysql = require("mysql2");

const pool = mysql.createPool({
	host: "connect4.database",
	user: "user",
	password: "X8aQbULcbmR9DS5Y",
	database: "data",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
	dateStrings: true,
});

const db = pool.promise();

module.exports = db;
