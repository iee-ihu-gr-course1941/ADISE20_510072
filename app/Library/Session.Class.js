class Session {
	constructor(session_id) {
		this.id = session_id;
		this.user_id = null;
		this.last_update = new Date().getTime();
		this._sockets = {};
		this.gamesPlaying = [];
		this.gamesWatching = [];
	}
	send(mesasge) {
		try {
			for (const socket_id in this._sockets) {
				if (this._sockets.hasOwnProperty(socket_id)) {
					const socket = this._sockets[socket_id];
					if (typeof socket.send === "function") {
						socket.send(JSON.stringify(mesasge));
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	}
	addSocket(socket_id, socket) {
		this._sockets[socket_id] = socket;
	}
	removeSocket(socket_id) {
		if (typeof this._sockets[socket_id] !== "undefined") {
			delete this._sockets[socket_id];
		}
	}
	addPlayingGame(token) {
		if (this.gamesPlaying.indexOf(token) === -1) {
			this.gamesPlaying.push(token);
		}
	}
	removePlayingGame(token) {
		this.gamesPlaying = this.gamesPlaying.filter((e) => e !== token);
	}
	addWatchingGame(token) {
		if (this.gamesWatching.indexOf(token) === -1) {
			this.gamesWatching.push(token);
		}
	}
	removeWatchingGame(token) {
		this.gamesWatching = this.gamesWatching.filter((e) => e !== token);
	}
}

module.exports = Session;
