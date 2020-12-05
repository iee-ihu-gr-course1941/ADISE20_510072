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
									$(_this).find("input").prop("disabled", false);
									$(_this).find("button").prop("disabled", false);
									return;
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
									$(_this).find("input").prop("disabled", false);
									$(_this).find("button").prop("disabled", false);
									return;
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
					if (typeof window.app.data.profile.name !== "undefined") {
						$(navbarFragmentHtml).find("#main-navbar-list-name").html(window.app.data.profile.name);
					}

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
									$(_this).find("input").prop("disabled", false);
									$(_this).find("button").prop("disabled", false);
									return;
								}
								window.location.reload();
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
								return;
							}

							if (hasErrors) {
								$(_this).find("input").prop("disabled", false);
								$(_this).find("button").prop("disabled", false);
								return;
							}

							window.app.ws.send({ action: "/password/change", payload: data }, function (resp) {
								if (resp.error) {
									alert(resp.desc);
									$(_this).find("input").prop("disabled", false);
									$(_this).find("button").prop("disabled", false);
									return;
								}
								window.location.reload();
							});
						});

					window.app.ws.send({ action: "/profile" }, function (resp) {
						if (resp.error === true) {
							alert(resp.desc);
							return;
						}
						var name = [];
						if (typeof resp.resp.first_name !== "undefined") {
							name.push(resp.resp.first_name);
							$(profileFragmentHtml).find("#profile-update-form input[name='first_name']").attr("placeholder", resp.resp.first_name);
						}
						if (typeof resp.resp.last_name !== "undefined") {
							name.push(resp.resp.last_name);
							$(profileFragmentHtml).find("#profile-update-form input[name='last_name']").attr("placeholder", resp.resp.last_name);
						}

						if (name.length > 0) {
							$(profileFragmentHtml).find("#profile-info-name").html(name.join(" "));
						}
						if (typeof resp.resp.score !== "undefined") {
							$(profileFragmentHtml).find("#profile-info-score").html(resp.resp.score);
						}
						if (typeof resp.resp.registered_timestamp !== "undefined") {
							$(profileFragmentHtml)
								.find("#profile-info-registration-data")
								.html(new Date(resp.resp.registered_timestamp * 1000).toString());
						}

						$("#app").append(profileFragmentHtml);
					});
					break;

				case "#dashboard":
					$("#app").html("");
					var navbarFragment = $("#navbar-fragment").html();
					var navbarFragmentHtml = $.parseHTML(navbarFragment);
					if (typeof window.app.data.profile.name !== "undefined") {
						$(navbarFragmentHtml).find("#main-navbar-list-name").html(window.app.data.profile.name);
					}
					$("#app").append(navbarFragmentHtml);

					var gameListFragment = $("#game-list-fragment").html();
					var gameListFragmentHtml = $.parseHTML(gameListFragment);
					$(gameListFragmentHtml)
						.find("#game-list-btn-create")
						.click(function () {
							window.app.ws.send({ action: "/game/create" }, function (resp) {
								if (resp.error === true) {
									alert(resp.desc);
									return;
								}
								window.app.ws.send({ action: "/games/open/get" });
							});
						});

					window.app.ws.send({ action: "/games/open/get" }, function (resp) {
						if (resp.error === true) {
							alert(resp.desc);
							return;
						}
						if (!Array.isArray(resp.resp)) {
							alert("Υπήρξε κάποιο πρόβλημα");
							return;
						}
						window.app.ui.drawGameList(resp.resp);
					});
					$("#app").append(gameListFragmentHtml);
					break;

				case "#scoreboard":
					$("#app").html("");
					var navbarFragment = $("#navbar-fragment").html();
					var navbarFragmentHtml = $.parseHTML(navbarFragment);
					if (typeof window.app.data.profile.name !== "undefined") {
						$(navbarFragmentHtml).find("#main-navbar-list-name").html(window.app.data.profile.name);
					}
					$("#app").append(navbarFragmentHtml);

					var scoreboardFragment = $("#scoreboard-fragment").html();
					var scoreboardFragmentHtml = $.parseHTML(scoreboardFragment);
					window.app.ws.send({ action: "/scoreboard" }, function (resp) {
						if (resp.error === true) {
							alert(resp.desc);
							return;
						}
						if (!Array.isArray(resp.resp)) {
							alert("Υπήρξε κάποιο πρόβλημα");
							return;
						}
						window.app.ui.drawScoreboard(resp.resp);
					});
					$("#app").append(scoreboardFragmentHtml);
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
			window.app.ws.send({ action: "/session" }, function (resp) {
				if (resp.error === true || typeof resp.resp.user_id === "undefined" || resp.resp.user_id === null) {
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
		drawGameList: function (games) {
			var gameListFragmentHtml = $("#main-game-list");

			if (games.length === 0) {
				$(gameListFragmentHtml)
					.find("#game-list-games")
					.html($("<div/>", { class: "alert alert-info w-100 alert-no-games", role: "alert" }).html("Δεν βρέθηκαν παιχνίδια. Δημιουργείστε ενα!"));
				return;
			}

			$(gameListFragmentHtml).find(".alert-no-games").remove();

			var gameTokens = [];
			var myGames = [];
			var openGames = [];
			var startedGames = [];
			for (var index = 0; index < games.length; index++) {
				var game = games[index];
				gameTokens.push(game.token);
				if (game.user_1 !== null && parseInt(game.user_1.id) === parseInt(window.app.data.profile.id)) {
					myGames.push(game);
					continue;
				}
				if (game.user_2 !== null && parseInt(game.user_2.id) === parseInt(window.app.data.profile.id)) {
					myGames.push(game);
					continue;
				}
				if (game.status === "CREATED") {
					openGames.push(game);
				}
				if (game.status === "STARTED") {
					startedGames.push(game);
				}
			}

			var currentGames = $(gameListFragmentHtml).find(".game-container[data-token]");
			for (var index = 0; index < currentGames.length; index++) {
				var _token = $(currentGames[index]).attr("data-token");
				if (gameTokens.indexOf(_token) === -1) {
					$(currentGames[index]).remove();
				}
			}

			if (myGames.length > 0) {
				for (var index = 0; index < myGames.length; index++) {
					var game = myGames[index];
					var currentElement = $(gameListFragmentHtml).find(".game-container[data-token='" + game.token + "']");
					if (currentElement.length === 1) {
						var gameListCardFragment = $("#game-list-card-elem").html();
						var gameListCardFragmentHtml = $.parseHTML(gameListCardFragment);

						$(gameListCardFragmentHtml).attr("id", "card-element-" + game.token);
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-continue").attr("data-game-token", game.token);
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-watch").remove();
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-play").remove();

						if (game.user_1 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player1")
								.html(game.user_1.first_name + " " + game.user_1.last_name);
						}
						if (game.user_2 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player2")
								.html(game.user_2.first_name + " " + game.user_2.last_name);
						}

						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-continue").attr("data-toggle", "modal");
						$(gameListCardFragmentHtml)
							.find("#game-list-card-elem-btn-continue")
							.attr("data-target", "#modal-game-" + game.token);

						$(currentElement)
							.find("#card-element-" + game.token)
							.replaceWith(gameListCardFragmentHtml);
					} else {
						var gameListCardFragment = $("#game-list-card-elem").html();
						var gameListCardFragmentHtml = $.parseHTML(gameListCardFragment);

						$(gameListCardFragmentHtml).attr("id", "card-element-" + game.token);
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-continue").attr("data-game-token", game.token);
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-watch").remove();
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-play").remove();

						if (game.user_1 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player1")
								.html(game.user_1.first_name + " " + game.user_1.last_name);
						}
						if (game.user_2 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player2")
								.html(game.user_2.first_name + " " + game.user_2.last_name);
						}

						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-continue").attr("data-toggle", "modal");
						$(gameListCardFragmentHtml)
							.find("#game-list-card-elem-btn-continue")
							.attr("data-target", "#modal-game-" + game.token);

						var gameModalElem = $("#game-modal-elem").html();
						var gameModalElemHtml = $.parseHTML(gameModalElem);
						$(gameModalElemHtml).attr("id", "modal-game-" + game.token);
						$(gameModalElemHtml).attr("data-token", game.token);

						var gameBoardFragment = $("#gameboard-fragment").html();
						var gameBoardFragmentHtml = $.parseHTML(gameBoardFragment);

						$(gameBoardFragmentHtml).find(".column").attr("data-token", game.token);

						$(gameModalElemHtml).find("#modal-main-content").append(gameBoardFragmentHtml);
						$(gameModalElemHtml)
							.find("#modal-main-abandon-btn")
							.attr("data-token", game.token)
							.click(function () {
								var r = confirm("Είστε σίγουροι;");
								if (r == false) {
									return;
								}
								var _token = $(this).attr("data-token");
								window.app.ws.send({ action: "/game/abandon", payload: { token: _token } }, function (resp) {
									if (resp.error === true) {
										alert(resp.desc);
										return;
									}
									$("#modal-game-" + _token).modal("hide");
								});
							});

						$(gameModalElemHtml).on("show.bs.modal", function (e) {
							var _token = $(this).attr("data-token");
							window.app.ws.send({ action: "/game/get/state", payload: { token: _token } });
						});
						$(gameModalElemHtml).on("hidden.bs.modal", function (e) {
							window.app.ws.send({ action: "/games/open/get" });
						});

						var gameContainer = $("<div/>", { class: "col-12 col-md-4 col-lg-3 col-xl-2 game-container" });
						$(gameContainer).attr("data-token", game.token);
						$(gameContainer).append(gameListCardFragmentHtml);
						$(gameContainer).append(gameModalElemHtml);

						$(gameListFragmentHtml).find("#game-list-games").append(gameContainer);
					}
				}
			}

			if (openGames.length > 0) {
				for (var index = 0; index < openGames.length; index++) {
					var game = openGames[index];
					var currentElement = $(gameListFragmentHtml).find(".game-container[data-token='" + game.token + "']");
					if (currentElement.length === 1) {
						var gameListCardFragment = $("#game-list-card-elem").html();
						var gameListCardFragmentHtml = $.parseHTML(gameListCardFragment);

						$(gameListCardFragmentHtml).attr("id", "card-element-" + game.token);
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-continue").remove();
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-watch").remove();
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-play").attr("data-game-token", game.token);

						if (game.user_1 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player1")
								.html(game.user_1.first_name + " " + game.user_1.last_name);
						}
						if (game.user_2 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player2")
								.html(game.user_2.first_name + " " + game.user_2.last_name);
						}

						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-play").attr("data-toggle", "modal");
						$(gameListCardFragmentHtml)
							.find("#game-list-card-elem-btn-play")
							.attr("data-target", "#modal-game-" + game.token);

						$(currentElement)
							.find("#card-element-" + game.token)
							.replaceWith(gameListCardFragmentHtml);
					} else {
						var gameListCardFragment = $("#game-list-card-elem").html();
						var gameListCardFragmentHtml = $.parseHTML(gameListCardFragment);

						$(gameListCardFragmentHtml).attr("id", "card-element-" + game.token);
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-continue").remove();
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-watch").remove();
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-play").attr("data-game-token", game.token);

						if (game.user_1 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player1")
								.html(game.user_1.first_name + " " + game.user_1.last_name);
						}
						if (game.user_2 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player2")
								.html(game.user_2.first_name + " " + game.user_2.last_name);
						}

						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-play").attr("data-toggle", "modal");
						$(gameListCardFragmentHtml)
							.find("#game-list-card-elem-btn-play")
							.attr("data-target", "#modal-game-" + game.token);

						var gameModalElem = $("#game-modal-elem").html();
						var gameModalElemHtml = $.parseHTML(gameModalElem);
						$(gameModalElemHtml).attr("id", "modal-game-" + game.token);
						$(gameModalElemHtml).attr("data-token", game.token);

						var gameBoardFragment = $("#gameboard-fragment").html();
						var gameBoardFragmentHtml = $.parseHTML(gameBoardFragment);

						$(gameBoardFragmentHtml).find(".column").attr("data-token", game.token);

						$(gameModalElemHtml).find("#modal-main-content").append(gameBoardFragmentHtml);
						$(gameModalElemHtml)
							.find("#modal-main-abandon-btn")
							.attr("data-token", game.token)
							.click(function () {
								var r = confirm("Είστε σίγουροι;");
								if (r == false) {
									return;
								}
								var _token = $(this).attr("data-token");
								window.app.ws.send({ action: "/game/abandon", payload: { token: _token } }, function (resp) {
									if (resp.error === true) {
										alert(resp.desc);
										return;
									}
								});
							});

						$(gameModalElemHtml).on("show.bs.modal", function (e) {
							var _token = $(this).attr("data-token");
							window.app.ws.send({ action: "/game/join", payload: { token: _token } }, function (resp) {
								if (resp.error === true) {
									alert(resp.desc);
									return;
								}
								window.app.ws.send({ action: "/game/get/state", payload: { token: _token } });
							});
						});
						$(gameModalElemHtml).on("hidden.bs.modal", function (e) {
							window.app.ws.send({ action: "/games/open/get" });
						});

						var gameContainer = $("<div/>", { class: "col-12 col-md-4 col-lg-3 col-xl-2 game-container" });
						$(gameContainer).attr("data-token", game.token);
						$(gameContainer).append(gameListCardFragmentHtml);
						$(gameContainer).append(gameModalElemHtml);

						$(gameListFragmentHtml).find("#game-list-games").append(gameContainer);
					}
				}
			}

			if (startedGames.length > 0) {
				for (var index = 0; index < startedGames.length; index++) {
					var game = startedGames[index];
					var currentElement = $(gameListFragmentHtml).find(".game-container[data-token='" + game.token + "']");
					if (currentElement.length === 1) {
						var gameListCardFragment = $("#game-list-card-elem").html();
						var gameListCardFragmentHtml = $.parseHTML(gameListCardFragment);

						$(gameListCardFragmentHtml).attr("id", "card-element-" + game.token);
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-continue").remove();
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-watch").attr("data-game-token", game.token);
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-play").remove();

						if (game.user_1 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player1")
								.html(game.user_1.first_name + " " + game.user_1.last_name);
						}
						if (game.user_2 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player2")
								.html(game.user_2.first_name + " " + game.user_2.last_name);
						}

						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-watch").attr("data-toggle", "modal");
						$(gameListCardFragmentHtml)
							.find("#game-list-card-elem-btn-watch")
							.attr("data-target", "#modal-game-" + game.token);

						$(currentElement)
							.find("#card-element-" + game.token)
							.replaceWith(gameListCardFragmentHtml);
					} else {
						var gameListCardFragment = $("#game-list-card-elem").html();
						var gameListCardFragmentHtml = $.parseHTML(gameListCardFragment);

						$(gameListCardFragmentHtml).attr("id", "card-element-" + game.token);
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-continue").remove();
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-watch").attr("data-game-token", game.token);
						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-play").remove();

						if (game.user_1 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player1")
								.html(game.user_1.first_name + " " + game.user_1.last_name);
						}
						if (game.user_2 !== null) {
							$(gameListCardFragmentHtml)
								.find("#game-list-card-elem-player2")
								.html(game.user_2.first_name + " " + game.user_2.last_name);
						}

						$(gameListCardFragmentHtml).find("#game-list-card-elem-btn-watch").attr("data-toggle", "modal");
						$(gameListCardFragmentHtml)
							.find("#game-list-card-elem-btn-watch")
							.attr("data-target", "#modal-game-" + game.token);

						var gameModalElem = $("#game-modal-elem").html();
						var gameModalElemHtml = $.parseHTML(gameModalElem);
						$(gameModalElemHtml).attr("id", "modal-game-" + game.token);
						$(gameModalElemHtml).attr("data-token", game.token);

						var gameBoardFragment = $("#gameboard-fragment").html();
						var gameBoardFragmentHtml = $.parseHTML(gameBoardFragment);

						$(gameBoardFragmentHtml).find(".column").attr("data-token", game.token);

						$(gameModalElemHtml).find("#modal-main-content").append(gameBoardFragmentHtml);

						$(gameModalElemHtml).on("show.bs.modal", function (e) {
							var _token = $(this).attr("data-token");
							window.app.ws.send({ action: "/game/watch", payload: { token: _token } }, function (resp) {
								if (resp.error === true) {
									alert(resp.desc);
									return;
								}
								window.app.ws.send({ action: "/game/get/state", payload: { token: _token } });
							});
						});
						$(gameModalElemHtml).on("hidden.bs.modal", function (e) {
							window.app.ws.send({ action: "/games/open/get" });
						});

						var gameContainer = $("<div/>", { class: "col-12 col-md-4 col-lg-3 col-xl-2 game-container" });
						$(gameContainer).attr("data-token", game.token);
						$(gameContainer).append(gameListCardFragmentHtml);
						$(gameContainer).append(gameModalElemHtml);

						$(gameListFragmentHtml).find("#game-list-games").append(gameContainer);
					}
				}
			}
		},
		drawBoard: function (info) {
			if (typeof info.token === "undefined") {
				return;
			}
			if (typeof info.board === "undefined") {
				return;
			}
			var token = String(info.token).trim();
			var board = info.board;
			var boardElem = $("#modal-game-" + token);

			$(boardElem).find(".gameboard-fragment-notification").addClass("d-none");
			var currentIntervalId = $(boardElem).find(".gameboard-fragment-notification").attr("data-interval-id");
			if (currentIntervalId !== "") {
				clearInterval(currentIntervalId);
			}

			switch (true) {
				case typeof info.isDraw !== "undefined" && Boolean(info.isDraw) === true:
					$(boardElem).find(".gameboard-fragment-notification").html("Το παιχνίδι έχει τελειώσει ισοπαλία").removeClass("d-none");
					$(boardElem).find(".modal-footer").remove();
					break;
				case typeof info.isEnded !== "undefined" && Boolean(info.isEnded) === true && info.winnerUser !== null:
					$(boardElem)
						.find(".gameboard-fragment-notification")
						.html("Το παιχνίδι έχει τελειώσει με νικητή: " + info.winnerUser.first_name + " " + info.winnerUser.last_name)
						.removeClass("d-none");
					$(boardElem).find(".modal-footer").remove();
					break;
				case typeof info.status !== "undefined" && info.status === "CREATED":
					$(boardElem).find(".gameboard-fragment-notification").html("Αναμένοντας αντίπαλο").removeClass("d-none");
					break;
				case typeof info.status !== "undefined" && info.status === "STARTED" && typeof info.nextUser !== "undefined" && info.nextUser !== null && window.app.data.profile.id === info.nextUser.id:
					var seconds = info.secondsForNextMove;
					var text = "Είναι η σειρά σου, έχεις {{SECONDS}} δευτερόλεπτα";
					$(boardElem).find(".gameboard-fragment-notification").attr("data-seconds", info.secondsForNextMove);
					$(boardElem).find(".gameboard-fragment-notification").attr("data-text", text);

					var intervalId = setInterval(
						function (elem) {
							var _seconds = $(elem).attr("data-seconds");
							var _text = $(elem).attr("data-text");
							if (_seconds - 1 > 0) {
								$(elem).attr("data-seconds", _seconds - 1);
								$(elem)
									.html(_text.replace("{{SECONDS}}", _seconds - 1))
									.removeClass("d-none");
							} else {
								var currentIntervalId = $(elem).attr("data-interval-id");
								if (currentIntervalId !== "") {
									clearInterval(currentIntervalId);
								}
							}
						},
						1 * 1000,
						$(boardElem).find(".gameboard-fragment-notification")
					);
					$(boardElem).find(".gameboard-fragment-notification").attr("data-interval-id", intervalId);
					$(boardElem).find(".gameboard-fragment-notification").html(text.replace("{{SECONDS}}", seconds)).removeClass("d-none");
					break;
				case typeof info.status !== "undefined" && info.status === "STARTED" && typeof info.nextUser !== "undefined" && info.nextUser !== null && window.app.data.profile.id !== info.nextUser.id:
					var seconds = info.secondsForNextMove;
					var text = "Είναι η σειρά του " + info.nextUser.first_name + " " + info.nextUser.last_name + ", και έχει {{SECONDS}} δευτερόλεπτα";
					$(boardElem).find(".gameboard-fragment-notification").attr("data-seconds", info.secondsForNextMove);
					$(boardElem).find(".gameboard-fragment-notification").attr("data-text", text);

					var intervalId = setInterval(
						function (elem) {
							var _seconds = $(elem).attr("data-seconds");
							var _text = $(elem).attr("data-text");
							if (_seconds - 1 > 0) {
								$(elem).attr("data-seconds", _seconds - 1);
								$(elem)
									.html(_text.replace("{{SECONDS}}", _seconds - 1))
									.removeClass("d-none");
							} else {
								var currentIntervalId = $(elem).attr("data-interval-id");
								if (currentIntervalId !== "") {
									clearInterval(currentIntervalId);
								}
							}
						},
						1 * 1000,
						$(boardElem).find(".gameboard-fragment-notification")
					);
					$(boardElem).find(".gameboard-fragment-notification").attr("data-interval-id", intervalId);
					$(boardElem).find(".gameboard-fragment-notification").html(text.replace("{{SECONDS}}", seconds)).removeClass("d-none");
					break;
			}

			for (var x in board) {
				var col = $(".column[data-x='" + x + "'][data-token='" + token + "']");
				$(col).off("click");
				if (typeof info.isEnded !== "undefined" && Boolean(info.isEnded) !== true) {
					if (typeof info.nextUser !== "undefined" && info.nextUser !== null && typeof info.nextUser.id !== "undefined" && parseInt(info.nextUser.id) === parseInt(window.app.data.profile.id)) {
						$(col).click(function () {
							var _x = $(this).attr("data-x");
							var _token = $(this).attr("data-token");
							window.app.ws.send({ action: "/game/make/move", payload: { token: _token, x: _x } }, function (resp) {
								if (resp.error === true) {
									alert(resp.desc);
									return;
								}
								window.app.ui.drawBoard(resp.resp);
							});
						});
					}
				}
				for (var y in board[x]) {
					var row = $(col).find("div[data-y='" + y + "']");
					$(row).removeClass("free").removeClass("user-1").removeClass("user-2");
					if (parseInt(board[x][y]) === 0) {
						$(row).addClass("free");
					} else {
						$(row).addClass("user-" + parseInt(board[x][y]));
					}
				}
			}
		},
		drawScoreboard: function (scoreboard) {
			var scoreboardHtml = $("#main-scoreboard");

			if (scoreboard.length === 0) {
				scoreboardHtml.append($("<div/>", { class: "alert alert-info w-100 alert-no" }).html("Δεν βρέθηκαν παίκτες"));
				return;
			}

			var table = $("<table/>", { class: "table table-striped" });
			var row = $("<tr/>");
			$(row).append($("<th/>").html("Θέση"));
			$(row).append($("<th/>").html("Όνομα"));
			$(row).append($("<th/>").html("Σκορ"));
			$(table).append(row);

			for (var index = 0; index < scoreboard.length; index++) {
				var score = scoreboard[index];
				row = $("<tr/>");
				$(row).append($("<td/>").html(index + 1));
				$(row).append($("<td/>").html(score.first_name + " " + score.last_name + " (" + score.email + ")"));
				$(row).append($("<td/>").html(score.score));
				$(table).append(row);
			}

			scoreboardHtml.append(table);
		},
	};
})(window);
