const WebSocket = require("ws");
const http_server = require("./Classes/HTTP.Server.Class")("public");
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

	const _socket_id = request["x-session-id"];

	if (!Servers.ws.sessions.hasOwnProperty(_socket_id)) {
		Servers.ws.sessions[_socket_id] = {
			id: _socket_id,
			user_id: null,
			last_update: new Date().getTime(),
			_socket: null,
		};
	}

	Servers.ws.sessions[_socket_id]._socket = socket;

	Servers.ws.sessions[_socket_id]._socket.on("message", async function incoming(message) {
		try {
			const json_message = JSON.parse(message);
			const response = await _api(json_message, Servers.ws.sessions[_socket_id]).catch((e) => {
				console.log(e);
			});

			console.log(response);

			if (Servers.ws.sessions.hasOwnProperty(_socket_id) && Servers.ws.sessions[_socket_id]._socket !== null) {
				Servers.ws.sessions[_socket_id]._socket.send(JSON.stringify(response));
			}

			if (Array.isArray(response.notify)) {
				for (let i = 0; i < response.notify.length; i++) {
					const notify_user_id = response.notify[i];
					const notify_session = Servers.ws.sessions.find((o) => o.user_id === notify_user_id && o._socket !== null);
					if (typeof notify_session !== "undefined") {
						notify_session._socket.send(JSON.stringify(response));
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	});

	Servers.ws.sessions[_socket_id]._socket.on("close", function close() {
		Servers.ws.sessions[_socket_id]._socket.close();
		delete Servers.ws.sessions[_socket_id]._socket;
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
