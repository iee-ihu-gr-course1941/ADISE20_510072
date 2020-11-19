const Users = require("../Classes/Users.Class");
const Stats = require("../Classes/Stats.Class");
const Games = require("../Classes/Games.Class");

const controllers = {
	Users: class {
		async register(payload, session) {
			let resp = {
				error: false,
				desc: "",
				resp: null,
			};
			try {
				if (typeof payload.first_name === "undefined" || payload.first_name == null || String(payload.first_name).trim() === "") {
					resp.error = true;
					resp.desc = "first_name is required";
					return resp;
				}
				if (typeof payload.last_name === "undefined" || payload.last_name == null || String(payload.last_name).trim() === "") {
					resp.error = true;
					resp.desc = "last_name is required";
					return resp;
				}
				if (typeof payload.email === "undefined" || payload.email == null || String(payload.email).trim() === "") {
					resp.error = true;
					resp.desc = "email is required";
					return resp;
				}
				if (typeof payload.password === "undefined" || payload.password == null || String(payload.password).trim() === "") {
					resp.error = true;
					resp.desc = "password is required";
					return resp;
				}

				const UsersObj = new Users();
				const user_id = await UsersObj.register(payload.email, payload.password, payload.first_name, payload.last_name).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				const user = await UsersObj.getById(user_id).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				delete user.password;
				session.user_id = parseInt(user.id);
				resp.resp = user;
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async login(payload, session) {
			let resp = {
				error: false,
				desc: "",
				resp: null,
			};
			try {
				if (typeof payload.email === "undefined" || payload.email == null || String(payload.email).trim() === "") {
					resp.error = true;
					resp.desc = "email is required";
					return resp;
				}
				if (typeof payload.password === "undefined" || payload.password == null || String(payload.password).trim() === "") {
					resp.error = true;
					resp.desc = "password is required";
					return resp;
				}
				const UsersObj = new Users();
				const user = await UsersObj.login(payload.email, payload.password).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				session.user_id = parseInt(user.id);
				resp.resp = user;
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async logout(payload, session) {
			let resp = {
				error: false,
				desc: "",
				resp: null,
			};
			try {
				if (typeof session.user_id === "undefined" || session.user_id == null || String(session.user_id).trim() === "") {
					resp.error = true;
					resp.desc = "user must be logged in";
					return resp;
				}
				session.user_id = null;
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async changePassword(payload, session) {
			let resp = {
				error: false,
				desc: "",
				resp: null,
			};
			try {
				if (typeof session.user_id === "undefined" || session.user_id == null || String(session.user_id).trim() === "") {
					resp.error = true;
					resp.desc = "user must be logged in";
					return resp;
				}
				if (typeof payload.old_password === "undefined" || payload.old_password == null || String(payload.old_password).trim() === "") {
					resp.error = true;
					resp.desc = "old_password is required";
					return resp;
				}
				if (typeof payload.new_password === "undefined" || payload.new_password == null || String(payload.new_password).trim() === "") {
					resp.error = true;
					resp.desc = "new_password is required";
					return resp;
				}
				const UsersObj = new Users();
				const user = await UsersObj.changePassword(session.user_id, payload.old_password, payload.new_password).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				session.user_id = parseInt(user.id);
				resp.resp = user;
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async changeName(payload, session) {
			let resp = {
				error: false,
				desc: "",
				resp: null,
			};
			try {
				if (typeof session.user_id === "undefined" || session.user_id == null || String(session.user_id).trim() === "") {
					resp.error = true;
					resp.desc = "user must be logged in";
					return resp;
				}
				if (typeof payload.first_name === "undefined" || payload.first_name == null || String(payload.first_name).trim() === "") {
					resp.error = true;
					resp.desc = "first_name is required";
					return resp;
				}
				if (typeof payload.last_name === "undefined" || payload.last_name == null || String(payload.last_name).trim() === "") {
					resp.error = true;
					resp.desc = "last_name is required";
					return resp;
				}
				const UsersObj = new Users();
				const user = await UsersObj.changeName(session.user_id, payload.first_name, payload.last_name).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				session.user_id = parseInt(user.id);
				resp.resp = user;
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async profile(payload, session) {
			let resp = {
				error: false,
				desc: "",
				resp: null,
			};
			try {
				if (typeof session.user_id === "undefined" || session.user_id == null || String(session.user_id).trim() === "") {
					resp.error = true;
					resp.desc = "user must be logged in";
					return resp;
				}
				const UsersObj = new Users();
				const user = await UsersObj.getById(session.user_id).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				delete user.password;
				session.user_id = parseInt(user.id);
				resp.resp = user;
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
	},
	Stats: class {
		async scoreboard(payload, session) {
			let resp = {
				error: false,
				desc: "",
				resp: null,
			};
			try {
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
	},
	Games: class {
		async games(payload, session) {
			let resp = {
				error: false,
				desc: "",
				resp: null,
			};
			try {
				if (typeof session.user_id === "undefined" || session.user_id == null || String(session.user_id).trim() === "") {
					resp.error = true;
					resp.desc = "user must be logged in";
					return resp;
				}
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async createGame(payload, session) {
			let resp = {
				error: false,
				desc: "",
				resp: null,
			};
			try {
				if (typeof session.user_id === "undefined" || session.user_id == null || String(session.user_id).trim() === "") {
					resp.error = true;
					resp.desc = "user must be logged in";
					return resp;
				}
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async joinGame(payload, session) {
			let resp = {
				error: false,
				desc: "",
				resp: null,
			};
			try {
				if (typeof session.user_id === "undefined" || session.user_id == null || String(session.user_id).trim() === "") {
					resp.error = true;
					resp.desc = "user must be logged in";
					return resp;
				}
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
	},
};

module.exports.controllers = {
	Users: new controllers.Users(),
	Stats: new controllers.Stats(),
	Games: new controllers.Games(),
};
