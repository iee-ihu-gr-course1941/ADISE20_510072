(function (window, WebSocket) {
	window.app.ws._socket = new WebSocket(window.app.ws.server, ["json"]);
	window.app.ws.callbacks = {};
	window.app.ws.send = function (obj, cb) {
		if (typeof cb === "function") {
			obj.mid = window.app.utils.uuidv4();
			window.app.ws.callbacks[obj.mid] = cb;
		}
		window.app.ws.waitForSocketConnection(function () {
			window.app.ws._socket.send(JSON.stringify(obj));
		});
	};
	window.app.ws.waitForSocketConnection = function (cb) {
		setTimeout(function () {
			if (window.app.ws._socket.readyState === 1) {
				if (cb != null) {
					cb();
				}
			} else {
				window.app.ws.waitForSocketConnection(cb);
			}
		}, 5);
	};
	window.app.ws._socket.addEventListener("close", function (event) {
		alert("Η συνδεση με τον server έκλεισε");
	});
	window.app.ws._socket.addEventListener("message", function (event) {
		var data = JSON.parse(event.data);
		if (typeof data.action !== "undefined" && typeof data.resp === "object" && data.resp !== null) {
			if (data.action === "/session") {
				window.app.data.user_id = data.resp.user_id;
				if (typeof data.resp.profile !== "undefined") {
					window.app.data.profile = data.resp.profile;
					window.app.data.profile.name = window.app.data.profile.first_name + " " + window.app.data.profile.last_name;
				}
			}
			if (data.action === "/login" || data.action === "/register" || data.action === "/profile") {
				window.app.data.profile = data.resp;
				window.app.data.profile.name = window.app.data.profile.first_name + " " + window.app.data.profile.last_name;
			}
		}
		console.log(data);
		if (typeof data.rmid !== "undefined" && typeof window.app.ws.callbacks[data.rmid] === "function") {
			window.app.ws.callbacks[data.rmid](data);
			delete window.app.ws.callbacks[data.rmid];
		} else {
			if (data.error === false) {
				switch (data.action) {
					case "/notify/game/status":
						if (typeof data.resp.status !== "undefined") {
							switch (data.resp.status) {
								case "CREATED":
								case "STARTED":
									window.app.ws.send({ action: "/games/open/get" }, function (_data) {
										window.app.ui.drawGameList(_data.resp);
										window.app.ui.drawBoard(data.resp);
									});
									break;

								case "COMPLETED":
								case "ABANDONED":
									window.app.ui.drawBoard(data.resp);
									break;

								default:
									break;
							}
						}

						break;

					case "/game/create":
					case "/game/join":
					case "/game/make/move":
					case "/game/get/state":
					case "/game/abandon":
						window.app.ui.drawBoard(data.resp);
						break;

					case "/games/open/get":
						window.app.ui.drawGameList(data.resp);
						break;
				}
			}
		}
	});
})(window, WebSocket);
