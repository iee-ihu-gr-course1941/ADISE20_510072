(function ($) {
	$.fn.serializeJSON = function () {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function () {
			if (o[this.name]) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || "");
			} else {
				o[this.name] = this.value || "";
			}
		});
		return o;
	};
})(jQuery);

(function (window) {
	window.app.utils = {
		uuidv4: function () {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
				var r = (Math.random() * 16) | 0,
					v = c == "x" ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});
		},
		validateEmail: function (text) {
			var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gm;
			return new RegExp(regex).test(text) ? true : false;
		},
		validatePassword: function (text) {
			var regex = /^(?=.*[a-z]{1})(?=.*[a-z]{1})(?=.*[A-Z]{1})(?=.*[A-Z]{1})(?=.*[0-9]{1})(?=.*[0-9]{1})(?=.*[!@#$%^&*]{1})(?=.*[!@#$%^&*]{1})(?=.{8,})/gm;
			return new RegExp(regex).test(text) ? true : false;
		},
		validateName: function (text) {
			var regex = /^[a-zA-Zs`'-.]{2,50}$/gm;
			return new RegExp(regex).test(text) ? true : false;
		},
	};
})(window);
