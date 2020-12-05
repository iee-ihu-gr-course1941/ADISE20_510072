const Users = require("../Library/Users.Class");
const Stats = require("../Library/Stats.Class");
const Games = require("../Library/Games.Class");
const { commonEmitter } = require("../Library/Events.Common");

const controllers = {
	Users: class {
		async session(payload, session) {
			let resp = {
				error: false,
				desc: "",
				resp: null,
			};
			try {
				resp.resp = Object.assign({}, session);
				delete resp.resp._sockets;
				delete resp.resp.last_update;
				if (typeof session.user_id !== "undefined" && session.user_id != null && String(session.user_id).trim() !== "") {
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
					resp.resp.profile = user;
				}
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
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
				if (typeof session.user_id === "undefined" || session.user_id == null || String(session.user_id).trim() === "") {
					resp.error = true;
					resp.desc = "user must be logged in";
					return resp;
				}
				const StatsObj = new Stats();
				const users = await StatsObj.scoreboard().catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				resp.resp = users;
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
	},
	Games: class {
		async getOpen(payload, session) {
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
				const GamesObj = new Games();
				const games = await GamesObj.getOpen().catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				resp.resp = games;
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async create(payload, session) {
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
				const GamesObj = new Games();
				const token = await GamesObj.create(session.user_id).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				const getCurrentState = await GamesObj.getCurrentState(token).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				resp.resp = getCurrentState;
				commonEmitter.emit("_system", "game/state/update", getCurrentState);
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async join(payload, session) {
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
				if (typeof payload.token === "undefined" || payload.token == null || String(payload.token).trim() === "") {
					resp.error = true;
					resp.desc = "token is required";
					return resp;
				}
				const GamesObj = new Games();
				const token = await GamesObj.join(payload.token, session.user_id).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}

				const games = await GamesObj.getOpen().catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				const currentGame = games.filter((g) => g.token === token);
				if (currentGame.length === 0) {
					resp.error = true;
					resp.desc = "Game not found";
				}
				if (resp.error) {
					return resp;
				}
				const getCurrentState = await GamesObj.getCurrentState(token).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				resp.resp = getCurrentState;
				commonEmitter.emit("_system", "game/state/update", getCurrentState);
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async makeMove(payload, session, runtime_games) {
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
				if (typeof payload.token === "undefined" || payload.token == null || String(payload.token).trim() === "") {
					resp.error = true;
					resp.desc = "token is required";
					return resp;
				}
				if (typeof payload.x === "undefined" || payload.x == null || String(payload.x).trim() === "") {
					resp.error = true;
					resp.desc = "x is required";
					return resp;
				}
				const GamesObj = new Games();
				const token = await GamesObj.makeMove(payload.token, session.user_id, payload.x).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				const getCurrentState = await GamesObj.getCurrentState(token).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				resp.resp = getCurrentState;
				commonEmitter.emit("_system", "game/state/update", getCurrentState);
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async getCurrentState(payload, session, runtime_games) {
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
				if (typeof payload.token === "undefined" || payload.token == null || String(payload.token).trim() === "") {
					resp.error = true;
					resp.desc = "token is required";
					return resp;
				}
				const GamesObj = new Games();
				const getCurrentState = await GamesObj.getCurrentState(payload.token).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				resp.resp = getCurrentState;
				commonEmitter.emit("_system", "game/state/update", getCurrentState);
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async abandon(payload, session, runtime_games) {
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
				if (typeof payload.token === "undefined" || payload.token == null || String(payload.token).trim() === "") {
					resp.error = true;
					resp.desc = "token is required";
					return resp;
				}
				const GamesObj = new Games();
				const token = await GamesObj.abandon(payload.token, session.user_id).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				const getCurrentState = await GamesObj.getCurrentState(token).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				resp.resp = getCurrentState;
				commonEmitter.emit("_system", "game/state/update", getCurrentState);
				return resp;
			} catch (error) {
				console.error(error);
				resp.error = true;
				resp.desc = "Internal Server Error";
				return resp;
			}
		}
		async watch(payload, session, runtime_games) {
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
				if (typeof payload.token === "undefined" || payload.token == null || String(payload.token).trim() === "") {
					resp.error = true;
					resp.desc = "token is required";
					return resp;
				}
				if (typeof runtime_games[payload.token] === "undefined" || runtime_games[payload.token] == null || String(runtime_games[payload.token]).trim() === "") {
					resp.error = true;
					resp.desc = "game is not in runtime is required";
					return resp;
				}
				const GamesObj = new Games();
				const getCurrentState = await GamesObj.getCurrentState(payload.token).catch((e) => {
					resp.error = true;
					resp.desc = e.message;
				});
				if (resp.error) {
					return resp;
				}
				resp.resp = getCurrentState;
				return resp;
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
