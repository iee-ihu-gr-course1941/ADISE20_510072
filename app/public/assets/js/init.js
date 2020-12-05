(function (window) {
	window.app = {};
	window.app.data = {
		user_id: null,
		profile: {},
	};
	window.app.ws = {
		server: "ws://" + window.location.href.split("/").slice(0, 3).join("/").split("://")[1] + "/",
	};
	window.app.ui = {};
	window.app.utils = {};
})(window);
