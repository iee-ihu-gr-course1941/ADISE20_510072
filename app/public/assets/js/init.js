(function (window) {
	window.app = {};
	window.app.data = {
		user_id: null,
		profile: {},
		gamesPlaying: [],
		gamesWatching: [],
	};
	window.app.ws = {
		server: "ws://localhost:8081/",
	};
	window.app.ui = {};
	window.app.utils = {};
})(window);
