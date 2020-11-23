const WebSocket = require("ws");
const http_server = require("./Classes/HTTP.Server.Class")("public");
const Session = require("./Classes/Session.Class");
const _utils = require("./Classes/Utils.Class");
const _api = require("./api/api");

const Servers = {
	http: {
		server: http_server,
	},
	ws: {
		server: new WebSocket.Server({
			server: http_server,
			clientTracking: false,
		}),
		sessions: {},
	},
};

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
			const response = await _api(json_message, Servers.ws.sessions[_session_id]).catch((e) => {
				console.log(e);
			});

			Servers.ws.sessions[_session_id].send(response);

			if (Array.isArray(response.notify)) {
				for (let i = 0; i < response.notify.length; i++) {
					const notify_user_id = parseInt(response.notify[i]);
					for (const j in Servers.ws.sessions) {
						if (Servers.ws.sessions.hasOwnProperty(j) && parseInt(Servers.ws.sessions[j].user_id) === notify_user_id) {
							Servers.ws.sessions[j].send(response);
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("close", function close() {
		Servers.ws.sessions[_session_id].removeSocket(_socket_id);
	});
});

Servers.http.server.listen(8000);

process
	.on("unhandledRejection", (reason, p) => {
		console.error(reason, "Unhandled Rejection at Promise", p);
	})
	.on("uncaughtException", (err) => {
		console.log("uncaughtException");
		console.error(err.stack);
		console.log(err);
	});
