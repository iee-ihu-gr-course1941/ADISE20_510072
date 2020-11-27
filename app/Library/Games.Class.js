const database = require("./Database");
const _utils = require("./Utils.Class");
const Users = require("./Users.Class");
const Connect4 = require("./Connect4.Class");

class Games {
	getById(game_id) {
		return new Promise(async (resolve, reject) => {
			try {
				game_id = parseInt(game_id);
				let q = `
					SELECT
						games.*,
						user_1.first_name AS user_1_first_name,
						user_1.last_name AS user_1_last_name,
						user_1.email AS user_1_email,
						user_2.first_name AS user_2_first_name,
						user_2.last_name AS user_2_last_name,
						user_2.email AS user_2_email
					FROM
						games
					LEFT JOIN users AS user_1
					ON
						games.user_id_1 = user_1.id
					LEFT JOIN users AS user_2
					ON
						games.user_id_2 = user_2.id
					WHERE
						games.id = ?
					LIMIT 1
				`;
				let params = [game_id];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.length !== 1) {
					throw new Error("Game not found");
				}
				const game = result[0];
				let game_data = {
					id: game.id,
					token: game.token,
					user_1: null,
					user_2: null,
					status: game.status,
					created_timestamp: game.created_timestamp,
					ended_timestamp: game.ended_timestamp,
					locked: game.locked,
				};
				if (game.user_id_1 !== null) {
					game_data.user_1 = {
						id: game.user_id_1,
						player: 1,
						first_name: game.user_1_first_name,
						last_name: game.user_1_last_name,
						email: game.user_1_email,
					};
				}
				if (game.user_id_2 !== null) {
					game_data.user_2 = {
						id: game.user_id_2,
						player: 2,
						first_name: game.user_2_first_name,
						last_name: game.user_2_last_name,
						email: game.user_2_email,
					};
				}
				resolve(game_data);
			} catch (error) {
				reject(error);
			}
		});
	}
	getByToken(token) {
		return new Promise(async (resolve, reject) => {
			try {
				token = String(token).trim();
				let q = `
					SELECT
						games.*,
						user_1.first_name AS user_1_first_name,
						user_1.last_name AS user_1_last_name,
						user_1.email AS user_1_email,
						user_2.first_name AS user_2_first_name,
						user_2.last_name AS user_2_last_name,
						user_2.email AS user_2_email
					FROM
						games
					LEFT JOIN users AS user_1
					ON
						games.user_id_1 = user_1.id
					LEFT JOIN users AS user_2
					ON
						games.user_id_2 = user_2.id
					WHERE
						games.token = ?
					LIMIT 1
				`;
				let params = [token];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.length !== 1) {
					throw new Error("Game not found");
				}
				const game = result[0];
				let game_data = {
					id: game.id,
					token: game.token,
					user_1: null,
					user_2: null,
					status: game.status,
					created_timestamp: game.created_timestamp,
					ended_timestamp: game.ended_timestamp,
					locked: game.locked,
				};
				if (game.user_id_1 !== null) {
					game_data.user_1 = {
						id: game.user_id_1,
						player: 1,
						first_name: game.user_1_first_name,
						last_name: game.user_1_last_name,
						email: game.user_1_email,
					};
				}
				if (game.user_id_2 !== null) {
					game_data.user_2 = {
						id: game.user_id_2,
						player: 2,
						first_name: game.user_2_first_name,
						last_name: game.user_2_last_name,
						email: game.user_2_email,
					};
				}
				resolve(game_data);
			} catch (error) {
				reject(error);
			}
		});
	}
	getHistory(game_id) {
		return new Promise(async (resolve, reject) => {
			try {
				game_id = parseInt(game_id);
				let q = "SELECT * FROM `games_history` WHERE `game_id` = ? ORDER BY `timestamp` DESC";
				let params = [game_id];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				resolve(result);
			} catch (error) {
				reject(error);
			}
		});
	}
	getOpen() {
		return new Promise(async (resolve, reject) => {
			try {
				let q = `
					SELECT
						games.*,
						user_1.first_name AS user_1_first_name,
						user_1.last_name AS user_1_last_name,
						user_1.email AS user_1_email,
						user_2.first_name AS user_2_first_name,
						user_2.last_name AS user_2_last_name,
						user_2.email AS user_2_email
					FROM
						games
					LEFT JOIN users AS user_1
					ON
						games.user_id_1 = user_1.id
					LEFT JOIN users AS user_2
					ON
						games.user_id_2 = user_2.id
					WHERE
					games.status = 'CREATED' OR games.status = 'STARTED'
				`;
				let [result] = await database.execute(q).catch((e) => {
					throw e;
				});
				let openGames = [];
				for (let index = 0; index < result.length; index++) {
					const game = result[index];
					let game_data = {
						token: game.token,
						user_1: null,
						user_2: null,
						status: game.status,
						created_timestamp: game.created_timestamp,
					};
					if (game.user_id_1 !== null) {
						game_data.user_1 = {
							id: game.user_id_1,
							first_name: game.user_1_first_name,
							last_name: game.user_1_last_name,
							email: game.user_1_email,
						};
					}
					if (game.user_id_2 !== null) {
						game_data.user_2 = {
							id: game.user_id_2,
							first_name: game.user_2_first_name,
							last_name: game.user_2_last_name,
							email: game.user_2_email,
						};
					}
					openGames.push(game_data);
				}
				resolve(openGames);
			} catch (error) {
				reject(error);
			}
		});
	}
	create(user_id_1) {
		return new Promise(async (resolve, reject) => {
			try {
				user_id_1 = parseInt(user_id_1);
				const UsersObj = new Users();
				const user_1 = await UsersObj.getById(user_id_1).catch((e) => {
					throw new Error(e.message);
				});

				const token = _utils.uuidv4();
				let q = `
					INSERT INTO games 
					(
						token,
						user_id_1,
						created_timestamp
					)
					VALUES(
						?,
						?,
						?
					)
				`;
				let params = [token, user_1.id, Math.floor(Date.now() / 1000)];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game not created");
				}
				resolve(token);
			} catch (error) {
				reject(error);
			}
		});
	}
	join(token, user_id_2) {
		return new Promise(async (resolve, reject) => {
			try {
				token = String(token).trim();
				user_id_2 = parseInt(user_id_2);
				const UsersObj = new Users();
				const user_2 = await UsersObj.getById(user_id_2).catch((e) => {
					throw new Error(e.message);
				});

				const game = await this.getByToken(token).catch((e) => {
					throw new Error(e.message);
				});

				if (game.status !== "CREATED") {
					throw new Error("Game already started");
				}
				if (game.user_1.id === user_2.id) {
					throw new Error("User is already in the game");
				}

				let q = "UPDATE `games` SET `user_id_2`=?, `status`='STARTED' WHERE `id` = ? LIMIT 1";
				let params = [user_2.id, game.id];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game not joined");
				}
				const Connect4Class = new Connect4();
				q = `
					INSERT INTO games_history 
					(
						game_id, 
						user_id, 
						board, 
						timestamp					
					)
					VALUES(
						?,
						?,
						?,
						?
					)
				`;
				params = [game.id, user_2.id, JSON.stringify(Connect4Class.board), Math.floor(Date.now() / 1000)];
				[result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game initialization not saved");
				}
				resolve(game.token);
			} catch (error) {
				reject(error);
			}
		});
	}
	makeMove(token, user_id, x) {
		return new Promise(async (resolve, reject) => {
			try {
				token = String(token).trim();
				user_id = parseInt(user_id);
				x = parseInt(x);
				const UsersObj = new Users();
				const user = await UsersObj.getById(user_id).catch((e) => {
					throw new Error(e.message);
				});

				const game = await this.getByToken(token).catch((e) => {
					throw new Error(e.message);
				});

				if (game.status === "COMPLETED" || game.status === "ABANDONED") {
					throw new Error("Game is finished");
				}
				if (game.status === "CREATED") {
					throw new Error("Waiting for opponent");
				}
				if (game.status !== "STARTED") {
					throw new Error("Game not started");
				}
				if (game.user_1.id !== user.id && game.user_2.id !== user.id) {
					throw new Error("User is not in the game");
				}
				if (parseInt(game.locked) === 1) {
					throw new Error("Game is locked");
				}

				let q = "UPDATE `games` SET `locked`=1 WHERE `id` = ? LIMIT 1";
				let params = [game.id];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game not locked");
				}

				const gameHistory = await this.getHistory(game.id).catch((e) => {
					throw e;
				});

				if (gameHistory.length > 0 && parseInt(gameHistory[0].user_id) === parseInt(user.id)) {
					q = "UPDATE `games` SET `locked`=0 WHERE `id` = ? LIMIT 1";
					params = [game.id];
					await database.execute(q, params).catch((e) => {
						throw e;
					});
					throw new Error("Is not players turn");
				}

				let player = game.user_1.id === user.id ? 1 : 2;
				const board = gameHistory.length > 0 ? gameHistory[0].board : null;

				const Connect4Class = new Connect4(board);
				let makeMove = null;
				try {
					makeMove = Connect4Class.makeMove(player, x);
				} catch (error) {
					throw new Error("Illegal move");
				}

				q = `
					INSERT INTO games_history 
					(
						game_id, 
						user_id, 
						board, 
						ended, 
						draw, 
						timestamp					
					)
					VALUES(
						?,
						?,
						?,
						?,
						?,
						?
					)
				`;
				params = [game.id, user.id, JSON.stringify(makeMove.board), parseInt(makeMove.isEnded), parseInt(makeMove.isEnded && !makeMove.isWinner), Math.floor(Date.now() / 1000)];
				[result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game history not saved");
				}

				if (makeMove.isEnded) {
					q = "UPDATE `games` SET `status`='COMPLETED', `ended_timestamp`=?, `locked`=0 WHERE `id` = ? LIMIT 1";
					params = [Math.floor(Date.now() / 1000), game.id];
				} else {
					q = "UPDATE `games` SET `locked`=0 WHERE `id` = ? LIMIT 1";
					params = [game.id];
				}
				[result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game is still locked");
				}

				let pointsUser1 = 0;
				let pointsUser2 = 0;
				if (makeMove.isEnded) {
					if (!makeMove.isWinner) {
						pointsUser1 = 5;
						pointsUser2 = 5;
					} else {
						if (player === 1) {
							pointsUser1 = 10;
							pointsUser2 = 1;
						} else {
							pointsUser1 = 1;
							pointsUser2 = 10;
						}
					}
				}

				q = "UPDATE `users` SET `score`=`score`+? WHERE `id` = ? LIMIT 1";
				params = [pointsUser1, game.user_1.id];
				database.execute(q, params).catch((e) => {
					console.log(e);
				});
				q = "UPDATE `users` SET `score`=`score`+? WHERE `id` = ? LIMIT 1";
				params = [pointsUser2, game.user_2.id];
				database.execute(q, params).catch((e) => {
					console.log(e);
				});

				let resp = {
					token: game.token,
					user_id_1: game.user_1.id,
					user_1: game.user_1,
					user_id_2: game.user_2.id,
					user_2: game.user_2,
					board: makeMove.board,
					isEnded: makeMove.isEnded,
					winner: makeMove.isWinner ? user.id : null,
					next: player === 1 ? game.user_2 : game.user_1,
				};
				resolve(resp);
			} catch (error) {
				reject(error);
			}
		});
	}
	getCurrentState(token) {
		return new Promise(async (resolve, reject) => {
			try {
				token = String(token).trim();

				const game = await this.getByToken(token).catch((e) => {
					throw new Error(e.message);
				});

				const gameHistory = await this.getHistory(game.id).catch((e) => {
					throw e;
				});

				let nextUser = null;
				if (game.status === "STARTED") {
					if (gameHistory[0].user_id === game.user_1.id) {
						nextUser = game.user_2;
					}
					if (gameHistory[0].user_id === game.user_2.id) {
						nextUser = game.user_1;
					}
				}

				const latestGameHistory = {
					token: game.token,
					user_id_1: game.user_1.id,
					user_1: game.user_1,
					user_id_2: game.user_2 === null ? null : game.user_2.id,
					user_2: game.user_2,
					board: gameHistory.length > 0 ? gameHistory[0].board : null,
					isEnded: game.status === "COMPLETED" || game.status === "ABANDONED",
					winner: game.status === "COMPLETED" ? gameHistory[0].user_id : null,
					next: nextUser,
				};

				const Connect4Class = new Connect4(latestGameHistory.board);
				latestGameHistory.board = Connect4Class.board;

				let resp = {
					token: latestGameHistory.token,
					user_id_1: latestGameHistory.user_id_1,
					user_1: latestGameHistory.user_1,
					user_id_2: latestGameHistory.user_id_2,
					user_2: latestGameHistory.user_2,
					board: latestGameHistory.board,
					isEnded: latestGameHistory.isEnded,
					winner: latestGameHistory.isWinner,
					next: latestGameHistory.next,
				};
				resolve(resp);
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = Games;
