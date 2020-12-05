const database = require("./Database");

class Stats {
	scoreboard() {
		return new Promise(async (resolve, reject) => {
			try {
				const q = "SELECT * FROM `users` WHERE `score` > ? ORDER BY `score` DESC LIMIT 50";
				const params = [0];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.length === 0) {
					throw new Error("Scoreboard is empty");
				}
				let users = [];
				for (let index = 0; index < result.length; index++) {
					let user = result[index];
					delete user.password;
					users.push(user);
				}
				resolve(users);
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = Stats;
