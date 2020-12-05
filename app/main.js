const WebSocket = require("ws");
const http_server = require("./Library/HTTP.Server.Class")("public");
const Session = require("./Library/Session.Class");
const Games = require("./Library/Games.Class");
const _utils = require("./Library/Utils.Class");
const { commonEmitter } = require("./Library/Events.Common");
const _api = require("./api/api");
const cron = require("node-cron");

const Servers = {
	init: false,
	http: {
		server: http_server,
	},
	ws: {
		server: new WebSocket.Server({
			server: http_server,
			clientTracking: false,
		}),
		sessions: {},
		runtime_games: {},
	},
};

commonEmitter.on("_message", async (receivers, message) => {
	switch (true) {
		case receivers === "*":
			for (const j in Servers.ws.sessions) {
				if (Servers.ws.sessions.hasOwnProperty(j)) {
					Servers.ws.sessions[j].send(message);
				}
			}
			break;
		case receivers === "null":
			for (const j in Servers.ws.sessions) {
				if (Servers.ws.sessions.hasOwnProperty(j) && Servers.ws.sessions[j].user_id === null) {
					Servers.ws.sessions[j].send(message);
				}
			}
			break;
		case receivers === "!null":
			for (const j in Servers.ws.sessions) {
				if (Servers.ws.sessions.hasOwnProperty(j) && Servers.ws.sessions[j].user_id !== null) {
					Servers.ws.sessions[j].send(message);
				}
			}
			break;
	}
});

commonEmitter.on("_system", async (message, _data) => {
	switch (message) {
		case "init":
			if (Servers.init === false) {
				Servers.ws.server.on("error", (err) => {
					console.log("-----------------------------------------------------------------------------------------------------------------------");
					console.log(new Date().toString().replace(/T/, ":").replace(/\.\w*/, ""));
					console.log(err);
					console.log("-----------------------------------------------------------------------------------------------------------------------");
				});

				Servers.ws.server.on("headers", (headers, request) => {
					const cookies = _utils.parseCookies(request);
					request["x-session-id"] = !cookies.hasOwnProperty("x-session-id") ? _utils.uuidv4() : cookies["x-session-id"];
					headers.push("Set-Cookie: " + _utils.generateCookie("x-session-id", request["x-session-id"], 365));
				});

				Servers.ws.server.on("connection", (socket, request) => {
					if (!request.hasOwnProperty("x-session-id")) {
						socket.close();
						return;
					}

					const _session_id = request["x-session-id"];
					const _socket_id = _utils.uuidv4();

					if (!Servers.ws.sessions.hasOwnProperty(_session_id)) {
						Servers.ws.sessions[_session_id] = new Session(_session_id);
					}

					Servers.ws.sessions[_session_id].addSocket(_socket_id, socket);

					socket.on("message", async function incoming(message) {
						try {
							const json_message = JSON.parse(message);
							const response = await _api(json_message, Servers.ws.sessions[_session_id], Servers.ws.runtime_games).catch((e) => {
								console.log(e);
							});

							Servers.ws.sessions[_session_id].send(response);
						} catch (error) {
							console.log(error);
						}
					});

					socket.on("close", function close() {
						Servers.ws.sessions[_session_id].removeSocket(_socket_id);
					});
				});

				Servers.http.server.listen(8000);
				Servers.init = true;
			}
			break;

		case "game/state/update":
			if (typeof Servers.ws.runtime_games[_data.token] === "undefined") {
				Servers.ws.runtime_games[_data.token] = Object.assign({}, _data);
				Servers.ws.runtime_games[_data.token].nextMoveTimeout = null;
			}
			if (Servers.ws.runtime_games[_data.token].nextMoveTimeout !== null) {
				clearTimeout(Servers.ws.runtime_games[_data.token].nextMoveTimeout);
			}

			commonEmitter.emit("_message", "!null", { resp: _data, error: false, desc: "", action: "/notify/game/status" });

			switch (_data.status) {
				case "STARTED":
					if (_data.secondsForNextMove !== null) {
						Servers.ws.runtime_games[_data.token].nextMoveTimeout = setTimeout(
							async (_token, _userId) => {
								try {
									const GamesObj = new Games();
									const token = await GamesObj.abandon(_token, _userId).catch((e) => {
										throw e;
									});
									const getCurrentState = await GamesObj.getCurrentState(token).catch((e) => {
										throw e;
									});
									commonEmitter.emit("_system", "game/state/update", getCurrentState);
								} catch (error) {
									console.log(error);
								}
							},
							_data.secondsForNextMove * 1000,
							_data.token,
							_data.nextUser.id
						);
					} else {
						const GamesObj = new Games();
						const token = await GamesObj.abandon(_data.token, _data.nextUser.id).catch((e) => {
							throw e;
						});
						const getCurrentState = await GamesObj.getCurrentState(token).catch((e) => {
							throw e;
						});
						if (resp.error) {
							throw new Error(resp.error);
						}
						commonEmitter.emit("_system", "game/state/update", getCurrentState);
					}
					break;

				case "COMPLETED":
				case "ABANDONED":
					if (typeof Servers.ws.runtime_games[_data.token] !== "undefined") {
						delete Servers.ws.runtime_games[_data.token];
					}
					break;
			}
			break;
	}
});

cron.schedule("* * * * *", async () => {
	if (Servers.init === false) {
		try {
			const GamesObj = new Games();
			const games = await GamesObj.getOpen().catch((e) => {
				throw e;
			});
			for (let index = 0; index < games.length; index++) {
				const _data = games[index];
				const gamesState = await GamesObj.getCurrentState(_data.token).catch((e) => {
					throw e;
				});
				commonEmitter.emit("_system", "game/state/update", gamesState);
			}
			commonEmitter.emit("_system", "init");
		} catch (error) {
			console.log(error);
		}
	}
});

process
	.on("unhandledRejection", (reason, p) => {
		console.error(reason, "Unhandled Rejection at Promise", p);
	})
	.on("uncaughtException", (err) => {
		console.log("uncaughtException");
		console.error(err.stack);
		console.log(err);
	});
