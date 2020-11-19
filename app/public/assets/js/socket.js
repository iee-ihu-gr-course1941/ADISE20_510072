(function (window, WebSocket) {
	window.app.ws = {};
	window.app.ws._socket = new WebSocket("ws://localhost:8081/", ["json"]);
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
	window.app.ws._socket.addEventListener("message", function (event) {
		var data = JSON.parse(event.data);
		if (typeof data.rmid !== "undefined" && typeof window.app.ws.callbacks[data.rmid] === "function") {
			console.log(data);
			window.app.ws.callbacks[data.rmid](data);
			delete window.app.ws.callbacks[data.rmid];
		} else {
			switch (data.action) {
				case "/login":
					break;

				case "/register":
					break;

				case "/profile":
					break;

				default:
					break;
			}
		}
	});
})(window, WebSocket);
