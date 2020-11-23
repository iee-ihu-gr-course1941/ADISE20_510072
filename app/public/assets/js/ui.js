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

						if (resp.resp.length === 0) {
						} else {
							window.app.ui.rebuildGameList(resp.resp);
						}
					});
					$("#app").append(gameListFragmentHtml);
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
		rebuildGameList: function (games) {
			var gameListFragmentHtml = $("#main-game-list");
			var myGames = [];
			var openGames = [];
			var startedGames = [];
			for (var index = 0; index < games.length; index++) {
				var game = games[index];
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

			$(gameListFragmentHtml).find("#game-list-my-games").empty();
			if (myGames.length === 0) {
				$(gameListFragmentHtml)
					.find("#game-list-my-games")
					.append($("<div/>", { class: "col-12" }).html("Δεν βρέθηκαν παιχνίδια"));
			} else {
				for (var index = 0; index < myGames.length; index++) {
					var game = myGames[index];
					var gameListCardFragment = $("#game-list-card-elem").html();
					var gameListCardFragmentHtml = $.parseHTML(gameListCardFragment);

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

					var gameBoardFragment = $("#gameboard-fragment").html();
					var gameBoardFragmentHtml = $.parseHTML(gameBoardFragment);

					$(gameBoardFragmentHtml).find(".column").attr("data-token", game.token);
					$(gameBoardFragmentHtml)
						.find(".column")
						.click(function () {
							var _x = $(this).attr("data-x");
							var _token = $(this).attr("data-token");
							window.app.ws.send({ action: "/game/make/move", payload: { token: _token, x: _x } }, function (resp) {
								if (resp.error === true) {
									alert(resp.desc);
									return;
								}
								window.app.ui.drawBoard(resp.resp.token, resp.resp.board);
							});
						});

					$(gameModalElemHtml).find("#modal-main-content").append(gameBoardFragmentHtml);

					var gameCcontainer = $("<div/>", { class: "col-12 col-md-4 col-lg-3 col-xl-2" });
					$(gameCcontainer).append(gameListCardFragmentHtml);
					$(gameCcontainer).append(gameModalElemHtml);

					$(gameListFragmentHtml).find("#game-list-my-games").append(gameCcontainer);
				}
			}

			$(gameListFragmentHtml).find("#game-list-open-games").empty();
			if (openGames.length === 0) {
				$(gameListFragmentHtml)
					.find("#game-list-open-games")
					.append($("<div/>", { class: "col-12" }).html("Δεν βρέθηκαν παιχνίδια"));
			} else {
				for (var index = 0; index < openGames.length; index++) {
					var game = openGames[index];
					var gameListCardFragment = $("#game-list-card-elem").html();
					var gameListCardFragmentHtml = $.parseHTML(gameListCardFragment);

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

					$(gameListCardFragmentHtml)
						.find("#game-list-card-elem-btn-play")
						.click(function () {
							var _token = $(this).attr("data-game-token");
							window.app.ws.send({ action: "/game/join", payload: { token: _token } }, function (resp) {
								if (resp.error === true) {
									alert(resp.desc);
									return;
								}
							});
						});

					$(gameListFragmentHtml)
						.find("#game-list-open-games")
						.append($("<div/>", { class: "col-12 col-md-4 col-lg-3 col-xl-2" }).append(gameListCardFragmentHtml));
				}
			}

			$(gameListFragmentHtml).find("#game-list-started-games").empty();
			if (startedGames.length === 0) {
				$(gameListFragmentHtml)
					.find("#game-list-started-games")
					.append($("<div/>", { class: "col-12" }).html("Δεν βρέθηκαν παιχνίδια"));
			} else {
				for (var index = 0; index < startedGames.length; index++) {
					var game = startedGames[index];
					var gameListCardFragment = $("#game-list-card-elem").html();
					var gameListCardFragmentHtml = $.parseHTML(gameListCardFragment);

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

					// $(gameListCardFragmentHtml)
					// 	.find("#game-list-card-elem-btn-play")
					// 	.click(function () {
					// 		var _token = $(this).attr("data-game-token");
					// 		window.app.ws.send({ action: "/game/join", payload: { token: _token } }, function (resp) {
					// 			if (resp.error === true) {
					// 				alert(resp.desc);
					// 				return;
					// 			}
					// 		});
					// 	});

					$(gameListFragmentHtml)
						.find("#game-list-open-games")
						.append($("<div/>", { class: "col-12 col-md-4 col-lg-3 col-xl-2" }).append(gameListCardFragmentHtml));
				}
			}
		},
		drawBoard: function (token, board) {
			for (var x in board) {
				var col = $(".column[data-x='" + x + "'][data-token='" + token + "']");
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

			for (var x = 0; x <= board.length; x++) {
				for (var y = 0; y <= this.numCols; y++) {
					this.gameBoard[x][y] = 0;
				}
			}
		},
	};
})(window);
