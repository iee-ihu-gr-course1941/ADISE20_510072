(function (window) {
	window.app.ui = {
		hashRenderer: function (hash) {
			hash = String(hash).trim();
			switch (hash) {
				case "#login":
					$("#app").html("");
					var template = $("#login-template").html();
					var templateHtml = $.parseHTML(template);
					$(templateHtml)
						.find("#login-form")
						.submit(function (e) {
							e.preventDefault();
							var _this = this;
							var data = $(_this).serializeJSON();
							for (var k in data) {
								data[k] = data[k].trim();
							}

							$(_this).find("input").prop("disabled", true);
							$(_this).find("button").prop("disabled", true);

							$(_this).find("input[name='email']").removeClass("is-invalid");
							$(_this).find("input[name='password']").removeClass("is-invalid");

							let hasErrors = false;
							if (typeof data.email === "undefined" || !window.app.utils.validateEmail(data.email)) {
								$(_this).find("input[name='email']").addClass("is-invalid");
								hasErrors = true;
							}
							if (typeof data.password === "undefined" || !window.app.utils.validatePassword(data.password)) {
								$(_this).find("input[name='password']").addClass("is-invalid");
								hasErrors = true;
							}
							if (hasErrors) {
								$(_this).find("input").prop("disabled", false);
								$(_this).find("button").prop("disabled", false);
								return;
							}

							window.app.ws.send({ action: "/login", payload: data }, function (resp) {
								if (resp.error) {
									alert(resp.desc);
								}
								window.location.hash = "#dashboard";
							});
						});

					$("#app").append(templateHtml);
					break;

				case "#register":
					$("#app").html("");
					var template = $("#register-template").html();
					var templateHtml = $.parseHTML(template);
					$(templateHtml)
						.find("#register-form")
						.submit(function (e) {
							e.preventDefault();
							var _this = this;
							var data = $(_this).serializeJSON();
							for (var k in data) {
								data[k] = data[k].trim();
							}

							$(_this).find("input").prop("disabled", true);
							$(_this).find("button").prop("disabled", true);

							$(_this).find("input[name='first_name']").removeClass("is-invalid");
							$(_this).find("input[name='last_name']").removeClass("is-invalid");
							$(_this).find("input[name='email']").removeClass("is-invalid");
							$(_this).find("input[name='password']").removeClass("is-invalid");

							let hasErrors = false;
							if (typeof data.first_name === "undefined" || !window.app.utils.validateName(data.first_name)) {
								$(_this).find("input[name='first_name']").addClass("is-invalid");
								hasErrors = true;
							}
							if (typeof data.last_name === "undefined" || !window.app.utils.validateName(data.last_name)) {
								$(_this).find("input[name='last_name']").addClass("is-invalid");
								hasErrors = true;
							}
							if (typeof data.email === "undefined" || !window.app.utils.validateEmail(data.email)) {
								$(_this).find("input[name='email']").addClass("is-invalid");
								hasErrors = true;
							}
							if (typeof data.password === "undefined" || !window.app.utils.validatePassword(data.password)) {
								$(_this).find("input[name='password']").addClass("is-invalid");
								hasErrors = true;
							}
							if (hasErrors) {
								$(_this).find("input").prop("disabled", false);
								$(_this).find("button").prop("disabled", false);
								return;
							}

							window.app.ws.send({ action: "/register", payload: data }, function (resp) {
								if (resp.error) {
									alert(resp.desc);
								}
								window.location.hash = "#dashboard";
							});
						});

					$("#app").append(templateHtml);
					break;

				case "#logout":
					window.app.ws.send({ action: "/logout" }, function (resp) {
						window.location.hash = "#login";
					});
					break;

				case "#profile":
					$("#app").html("");
					var navbarFragment = $("#navbar-fragment").html();
					var navbarFragmentHtml = $.parseHTML(navbarFragment);
					$("#app").append(navbarFragmentHtml);
					var profileFragment = $("#profile-fragment").html();
					var profileFragmentHtml = $.parseHTML(profileFragment);
					$(profileFragmentHtml)
						.find("#profile-update-form")
						.submit(function (e) {
							e.preventDefault();
							var _this = this;
							var data = $(_this).serializeJSON();
							for (var k in data) {
								data[k] = data[k].trim();
							}

							$(_this).find("input").prop("disabled", true);
							$(_this).find("button").prop("disabled", true);

							$(_this).find("input[name='first_name']").removeClass("is-invalid");
							$(_this).find("input[name='last_name']").removeClass("is-invalid");

							let hasErrors = false;
							if (typeof data.first_name === "undefined" || !window.app.utils.validateName(data.first_name)) {
								$(_this).find("input[name='first_name']").addClass("is-invalid");
								hasErrors = true;
							}
							if (typeof data.last_name === "undefined" || !window.app.utils.validateName(data.last_name)) {
								$(_this).find("input[name='last_name']").addClass("is-invalid");
								hasErrors = true;
							}
							if (hasErrors) {
								$(_this).find("input").prop("disabled", false);
								$(_this).find("button").prop("disabled", false);
								return;
							}

							window.app.ws.send({ action: "/name/change", payload: data }, function (resp) {
								if (resp.error) {
									alert(resp.desc);
								}
								$(_this).find("input").prop("disabled", false);
								$(_this).find("button").prop("disabled", false);
								window.location.hash = "#profile";
							});
						});
					$(profileFragmentHtml)
						.find("#password-update-form")
						.submit(function (e) {
							e.preventDefault();
							var _this = this;
							var data = $(_this).serializeJSON();
							for (var k in data) {
								data[k] = data[k].trim();
							}

							$(_this).find("input").prop("disabled", true);
							$(_this).find("button").prop("disabled", true);

							$(_this).find("input[name='old_password']").removeClass("is-invalid");
							$(_this).find("input[name='new_password']").removeClass("is-invalid");
							$(_this).find("input[name='new_password2']").removeClass("is-invalid");

							let hasErrors = false;
							if (typeof data.old_password === "undefined" || !window.app.utils.validateName(data.old_password)) {
								$(_this).find("input[name='old_password']").addClass("is-invalid");
								hasErrors = true;
							}
							if (typeof data.new_password === "undefined" || !window.app.utils.validateName(data.new_password)) {
								$(_this).find("input[name='new_password']").addClass("is-invalid");
								hasErrors = true;
							}
							if (typeof data.new_password2 === "undefined" || !window.app.utils.validateName(data.new_password2)) {
								$(_this).find("input[name='new_password2']").addClass("is-invalid");
								hasErrors = true;
							}
							if (data.new_password !== data.new_password2) {
								$(_this).find("input[name='new_password']").addClass("is-invalid");
								$(_this).find("input[name='new_password2']").addClass("is-invalid");
								hasErrors = true;
								alert("Οι Κωδικοί δεν ταιριάζουν");
							}

							if (hasErrors) {
								$(_this).find("input").prop("disabled", false);
								$(_this).find("button").prop("disabled", false);
								return;
							}

							window.app.ws.send({ action: "/password/change", payload: data }, function (resp) {
								if (resp.error) {
									alert(resp.desc);
								}
								$(_this).find("input").prop("disabled", false);
								$(_this).find("button").prop("disabled", false);
								window.location.hash = "#profile";
							});
						});

					window.app.ws.send({ action: "/profile" }, function (resp) {
						if (resp.error === true) {
							alert(resp.desc);
						}
						if (typeof resp.resp.first_name !== "undefined") {
							$(profileFragmentHtml).find("#profile-update-form input[name='first_name']").attr("placeholder", resp.resp.first_name);
						}
						if (typeof resp.resp.last_name !== "undefined") {
							$(profileFragmentHtml).find("#profile-update-form input[name='last_name']").attr("placeholder", resp.resp.last_name);
						}
						$("#app").append(profileFragmentHtml);
					});
					break;

				case "#dashboard":
					$("#app").html("");
					var navbarFragment = $("#navbar-fragment").html();
					var navbarFragmentHtml = $.parseHTML(navbarFragment);
					$("#app").append(navbarFragmentHtml);
					break;

				default:
					break;
			}
		},
		gotToHash: function (hash) {
			var newHash = "";
			hash = String(hash).trim();
			if (hash == "") {
				hash = "#login";
			}
			window.app.ws.send({ action: "/profile" }, function (resp) {
				if (resp.error === true) {
					if (hash === "#login" || hash === "#register") {
						newHash = hash;
					} else {
						newHash = "#login";
					}
				} else {
					if (hash === "#login" || hash === "#register") {
						newHash = "#dashboard";
					} else {
						newHash = hash;
					}
				}

				if (window.location.hash === newHash) {
					window.app.ui.hashRenderer(window.location.hash);
				}
				window.location.hash = newHash;
			});
		},
	};
})(window);
