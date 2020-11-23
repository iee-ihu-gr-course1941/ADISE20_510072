const crypto = require("crypto");
const database = require("./Database");
const _utils = require("./Utils.Class");

class User {
	getById(user_id) {
		return new Promise(async (resolve, reject) => {
			try {
				user_id = parseInt(user_id);
				let q = "SELECT `id`, `first_name`, `last_name`, `email`, `password`, `score`, `registered_timestamp`, `blocked` FROM `users` WHERE `id` = ? LIMIT 1";
				let params = [user_id];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.length !== 1) {
					throw new Error("User not found");
				}
				let user = result[0];
				resolve(user);
			} catch (error) {
				reject(error);
			}
		});
	}
	getByEmail(email) {
		return new Promise(async (resolve, reject) => {
			try {
				email = String(email).trim();
				if (!_utils.validateEmail(email)) {
					throw new Error("Not valid email");
				}
				let q = "SELECT `id`, `first_name`, `last_name`, `email`, `password`, `score`, `registered_timestamp`, `blocked` FROM `users` WHERE `email` = ? LIMIT 1";
				let params = [email];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.length !== 1) {
					throw new Error("User not found");
				}
				let user = result[0];
				resolve(user);
			} catch (error) {
				reject(error);
			}
		});
	}
	register(email, password, first_name, last_name) {
		return new Promise(async (resolve, reject) => {
			try {
				email = String(email).trim();
				password = String(password).trim();
				first_name = String(first_name).trim();
				last_name = String(last_name).trim();
				if (!_utils.validateEmail(email)) {
					throw new Error("Not valid email");
				}
				if (!_utils.validatePassword(password)) {
					throw new Error("Not valid password");
				}
				if (!_utils.validateName(first_name)) {
					throw new Error("Not valid first name");
				}
				if (!_utils.validateName(last_name)) {
					throw new Error("Not valid last name");
				}
				const hashed_password = crypto.createHash("sha256").update(password).digest("hex");
				let q = "INSERT INTO `users`(`first_name`, `last_name`, `email`, `password`, `score`, `registered_timestamp`, `blocked`) VALUES (?,?,?,?,?,?,?)";
				let params = [first_name, last_name, email, hashed_password, 0, Math.floor(Date.now() / 1000), 0];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("User not registered");
				}
				resolve(result.insertId);
			} catch (error) {
				reject(error);
			}
		});
	}
	login(email, password) {
		return new Promise(async (resolve, reject) => {
			try {
				email = String(email).trim();
				password = String(password).trim();
				if (!_utils.validateEmail(email)) {
					throw new Error("Not valid email");
				}
				const hashed_password = crypto.createHash("sha256").update(password).digest("hex");
				const user = await this.getByEmail(email).catch((e) => {
					throw e;
				});
				if (parseInt(user.blocked) === 1) {
					throw new Error("User is blocked");
				}
				if (user.password !== hashed_password) {
					throw new Error("User password is wrong");
				}
				delete user.password;
				resolve(user);
			} catch (error) {
				reject(error);
			}
		});
	}
	changePassword(user_id, old_password, new_password) {
		return new Promise(async (resolve, reject) => {
			try {
				user_id = parseInt(user_id);
				old_password = String(old_password).trim();
				new_password = String(new_password).trim();
				if (!_utils.validatePassword(new_password)) {
					throw new Error("Not valid new password");
				}
				const hashed_old_password = crypto.createHash("sha256").update(old_password).digest("hex");
				const hashed_new_password = crypto.createHash("sha256").update(new_password).digest("hex");
				const user = await this.getById(user_id).catch((e) => {
					throw e;
				});
				if (parseInt(user.blocked) === 1) {
					throw new Error("User is blocked");
				}
				if (user.password !== hashed_old_password) {
					throw new Error("Old password does not match");
				}
				let q = "UPDATE `users` SET `password`=? WHERE `id` = ? LIMIT 1";
				let params = [hashed_new_password, user.id];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("User password not changed");
				}
				delete user.password;
				resolve(user);
			} catch (error) {
				reject(error);
			}
		});
	}
	changeName(user_id, first_name, last_name) {
		return new Promise(async (resolve, reject) => {
			try {
				user_id = parseInt(user_id);
				first_name = String(first_name).trim();
				last_name = String(last_name).trim();
				if (!_utils.validateName(first_name)) {
					throw new Error("Not valid first name");
				}
				if (!_utils.validateName(last_name)) {
					throw new Error("Not valid last name");
				}
				const user = await this.getById(user_id).catch((e) => {
					throw e;
				});
				if (parseInt(user.blocked) === 1) {
					throw new Error("User is blocked");
				}
				let q = "UPDATE `users` SET `first_name`=?, `last_name`=? WHERE `id` = ? LIMIT 1";
				let params = [first_name, last_name, user.id];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("User data not changed");
				}
				delete user.password;
				resolve(user);
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = User;
