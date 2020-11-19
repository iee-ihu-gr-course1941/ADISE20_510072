class Utils {
	static parseCookies(request) {
		var list = {},
			rc = request.headers.cookie;

		rc &&
			rc.split(";").forEach(function (cookie) {
				var parts = cookie.split("=");
				list[parts.shift().trim()] = decodeURI(parts.join("="));
			});

		return list;
	}
	static generateCookie(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = "; expires=" + date.toUTCString();
		}
		return name + "=" + (value || "") + expires + "; path=/";
	}
	static uuidv4() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
			var r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}
	static validateEmail(text) {
		var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm;
		return new RegExp(regex).test(text) ? true : false;
	}
	static validatePassword(text) {
		var regex = /^(?=.*[a-z]{1})(?=.*[a-z]{1})(?=.*[A-Z]{1})(?=.*[A-Z]{1})(?=.*[0-9]{1})(?=.*[0-9]{1})(?=.*[!@#$%^&*]{1})(?=.*[!@#$%^&*]{1})(?=.{8,})/gm;
		return new RegExp(regex).test(text) ? true : false;
	}
	static validateName(text) {
		var regex = /^[a-zA-Zs`'-.]{2,50}$/gm;
		return new RegExp(regex).test(text) ? true : false;
	}
}

module.exports = Utils;
