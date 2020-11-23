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
				if (typeof data.resp.gamesPlaying !== "undefined") {
					window.app.data.gamesPlaying = data.resp.gamesPlaying;
				}
				if (typeof data.resp.gamesWatching !== "undefined") {
					window.app.data.gamesWatching = data.resp.gamesWatching;
				}
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
			switch (data.action) {
				case "/game/make/move":
					window.app.ui.drawBoard(data.resp.token, data.resp.board);
					break;

				default:
					break;
			}
		}
	});
})(window, WebSocket);
