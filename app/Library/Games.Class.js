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
						user_1.score AS user_1_score,
						user_1.registered_timestamp AS user_1_registered_timestamp,
						user_1.blocked AS user_1_blocked,
						user_2.first_name AS user_2_first_name,
						user_2.last_name AS user_2_last_name,
						user_2.score AS user_2_score,
						user_2.registered_timestamp AS user_2_registered_timestamp,
						user_2.blocked AS user_2_blocked,
						user_2.email AS user_2_email
					FROM
						games
					LEFT JOIN users AS user_1
					ON
						games.user_1_id = user_1.id
					LEFT JOIN users AS user_2
					ON
						games.user_2_id = user_2.id
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
				if (game.user_1_id !== null) {
					game_data.user_1 = {
						id: game.user_1_id,
						email: game.user_1_email,
						first_name: game.user_1_first_name,
						last_name: game.user_1_last_name,
						score: game.user_1_score,
						registered_timestamp: game.user_1_registered_timestamp,
						blocked: game.user_1_blocked,
					};
				}
				if (game.user_2_id !== null) {
					game_data.user_2 = {
						id: game.user_2_id,
						email: game.user_2_email,
						first_name: game.user_2_first_name,
						last_name: game.user_2_last_name,
						score: game.user_2_score,
						registered_timestamp: game.user_2_registered_timestamp,
						blocked: game.user_2_blocked,
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
						user_1.score AS user_1_score,
						user_1.registered_timestamp AS user_1_registered_timestamp,
						user_1.blocked AS user_1_blocked,
						user_2.first_name AS user_2_first_name,
						user_2.last_name AS user_2_last_name,
						user_2.score AS user_2_score,
						user_2.registered_timestamp AS user_2_registered_timestamp,
						user_2.blocked AS user_2_blocked,
						user_2.email AS user_2_email
					FROM
						games
					LEFT JOIN users AS user_1
					ON
						games.user_1_id = user_1.id
					LEFT JOIN users AS user_2
					ON
						games.user_2_id = user_2.id
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
				if (game.user_1_id !== null) {
					game_data.user_1 = {
						id: game.user_1_id,
						email: game.user_1_email,
						first_name: game.user_1_first_name,
						last_name: game.user_1_last_name,
						score: game.user_1_score,
						registered_timestamp: game.user_1_registered_timestamp,
						blocked: game.user_1_blocked,
					};
				}
				if (game.user_2_id !== null) {
					game_data.user_2 = {
						id: game.user_2_id,
						email: game.user_2_email,
						first_name: game.user_2_first_name,
						last_name: game.user_2_last_name,
						score: game.user_2_score,
						registered_timestamp: game.user_2_registered_timestamp,
						blocked: game.user_2_blocked,
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
						user_1.score AS user_1_score,
						user_1.registered_timestamp AS user_1_registered_timestamp,
						user_1.blocked AS user_1_blocked,
						user_2.first_name AS user_2_first_name,
						user_2.last_name AS user_2_last_name,
						user_2.email AS user_2_email,
						user_2.score AS user_2_score,
						user_2.registered_timestamp AS user_2_registered_timestamp,
						user_2.blocked AS user_2_blocked
					FROM
						games
					LEFT JOIN users AS user_1
					ON
						games.user_1_id = user_1.id
					LEFT JOIN users AS user_2
					ON
						games.user_2_id = user_2.id
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
					if (game.user_1_id !== null) {
						game_data.user_1 = {
							id: game.user_1_id,
							first_name: game.user_1_first_name,
							last_name: game.user_1_last_name,
							email: game.user_1_email,
							score: game.user_1_score,
							registered_timestamp: game.user_1_registered_timestamp,
							blocked: game.user_1_blocked,
						};
					}
					if (game.user_2_id !== null) {
						game_data.user_2 = {
							id: game.user_2_id,
							first_name: game.user_2_first_name,
							last_name: game.user_2_last_name,
							email: game.user_2_email,
							score: game.user_2_score,
							registered_timestamp: game.user_2_registered_timestamp,
							blocked: game.user_2_blocked,
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
	create(user_1_id) {
		return new Promise(async (resolve, reject) => {
			try {
				user_1_id = parseInt(user_1_id);
				const UsersObj = new Users();
				const user_1 = await UsersObj.getById(user_1_id).catch((e) => {
					throw new Error(e.message);
				});

				const token = _utils.uuidv4();
				let q = `
					INSERT INTO games 
					(
						token,
						user_1_id,
						created_timestamp,
						last_updated_timestamp
					)
					VALUES(
						?,
						?,
						?,
						?
					)
				`;
				let params = [token, user_1.id, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000)];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game not created");
				}
				const Connect4Class = new Connect4();
				q = `
					INSERT INTO games_history 
					(
						game_id, 
						current_player, 
						next_player, 
						board, 
						timestamp					
					)
					VALUES(
						?,
						?,
						?,
						?,
						?
					)
				`;
				params = [result.insertId, 1, 1, JSON.stringify(Connect4Class.board), Math.floor(Date.now() / 1000)];
				[result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game initialization not saved");
				}
				resolve(token);
			} catch (error) {
				reject(error);
			}
		});
	}
	join(token, user_2_id) {
		return new Promise(async (resolve, reject) => {
			try {
				token = String(token).trim();
				user_2_id = parseInt(user_2_id);
				const UsersObj = new Users();
				const user_2 = await UsersObj.getById(user_2_id).catch((e) => {
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
				if (game.user_2 !== null) {
					throw new Error("Game already in progress");
				}

				let q = "UPDATE `games` SET `user_2_id`=?, `status`='STARTED', `last_updated_timestamp`=? WHERE `id` = ? LIMIT 1";
				let params = [user_2.id, Math.floor(Date.now() / 1000), game.id];
				let [result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game not joined");
				}
				const gameHistory = await this.getHistory(game.id).catch((e) => {
					throw e;
				});
				q = "UPDATE `games_history` SET `timestamp`=? WHERE `id` = ? LIMIT 1";
				params = [Math.floor(Date.now() / 1000), gameHistory[0].id];
				[result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				resolve(game.token);
			} catch (error) {
				reject(error);
			}
		});
	}
	abandon(token, user_id) {
		return new Promise(async (resolve, reject) => {
			try {
				token = String(token).trim();
				user_id = parseInt(user_id);
				const UsersObj = new Users();
				const user = await UsersObj.getById(user_id).catch((e) => {
					throw new Error(e.message);
				});

				const game = await this.getByToken(token).catch((e) => {
					throw new Error(e.message);
				});

				if (game.status === "COMPLETED" || game.status === "ABANDONED") {
					throw new Error("Game already finished");
				}
				if (game.user_2 === null) {
					if (game.user_1.id !== user.id) {
						throw new Error("User is not in the game");
					}
				} else {
					if (game.user_1.id !== user.id && game.user_2.id !== user.id) {
						throw new Error("User is not in the game");
					}
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

				let playerCurrent = game.user_1.id === user.id ? 1 : 2;
				let playerNext = game.user_1.id === user.id ? 2 : 1;
				const board = gameHistory.length > 0 ? gameHistory[0].board : null;

				const Connect4Class = new Connect4(board);
				q = `
					INSERT INTO games_history 
					(
						game_id, 
						current_player, 
						next_player, 
						board, 
						ended, 
						draw, 
						winner, 
						timestamp					
					)
					VALUES(
						?,
						?,
						?,
						?,
						?,
						?,
						?,
						?
					)
				`;
				params = [game.id, playerCurrent, null, JSON.stringify(Connect4Class.board), 1, 0, playerNext, Math.floor(Date.now() / 1000)];
				[result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game history not saved");
				}

				q = "UPDATE `games` SET `status`='ABANDONED', `last_updated_timestamp`=?, `ended_timestamp`=?, `locked`=0 WHERE `id` = ? LIMIT 1";
				params = [Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000), game.id];
				[result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game is still locked");
				}

				if (game.user_2 !== null) {
					let pointsUser1 = 0;
					let pointsUser2 = 0;
					if (playerCurrent === 1) {
						pointsUser1 = 10;
						pointsUser2 = 1;
					} else {
						pointsUser1 = 1;
						pointsUser2 = 10;
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

				let playerCurrent = game.user_1.id === user.id ? 1 : 2;
				let playerNext = game.user_1.id === user.id ? 2 : 1;
				const board = gameHistory.length > 0 ? gameHistory[0].board : null;

				const Connect4Class = new Connect4(board);
				let makeMove = null;
				try {
					makeMove = Connect4Class.makeMove(playerCurrent, x);
				} catch (error) {
					throw new Error("Illegal move");
				}

				console.log(makeMove);

				let ended = makeMove.isEnded;
				let draw = makeMove.isEnded && !makeMove.isWinner;
				let winner = null;
				if (ended === true && draw === false) {
					winner = playerCurrent;
				}

				q = `
					INSERT INTO games_history 
					(
						game_id, 
						current_player, 
						next_player, 
						board, 
						ended, 
						draw, 
						winner, 
						timestamp					
					)
					VALUES(
						?,
						?,
						?,
						?,
						?,
						?,
						?,
						?
					)
				`;
				params = [game.id, playerCurrent, playerNext, JSON.stringify(makeMove.board), ended, draw, winner, Math.floor(Date.now() / 1000)];
				[result] = await database.execute(q, params).catch((e) => {
					throw e;
				});
				if (result.affectedRows === 0) {
					throw new Error("Game history not saved");
				}

				if (makeMove.isEnded) {
					q = "UPDATE `games` SET `status`='COMPLETED', `last_updated_timestamp`=?, `ended_timestamp`=?, `locked`=0 WHERE `id` = ? LIMIT 1";
					params = [Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000), game.id];
				} else {
					q = "UPDATE `games` SET `locked`=0, `last_updated_timestamp`=? WHERE `id` = ? LIMIT 1";
					params = [Math.floor(Date.now() / 1000), game.id];
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
						if (playerCurrent === 1) {
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

				resolve(game.token);
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

				let secondsForNextMove = 60 - (Math.floor(Date.now() / 1000) - gameHistory[0].timestamp);

				const latestGameHistory = {
					token: game.token,
					status: game.status,
					user_1_id: game.user_1.id,
					user_1: game.user_1,
					user_2_id: game.user_2 === null ? null : game.user_2.id,
					user_2: game.user_2,
					board: gameHistory.length > 0 ? gameHistory[0].board : null,
					currentPlayer: gameHistory[0].current_player,
					nextPlayer: gameHistory[0].next_player,
					isEnded: gameHistory[0].ended,
					isDraw: gameHistory[0].draw,
					winner: gameHistory[0].winner,
					winnerUser: (game.status === "COMPLETED" || game.status === "ABANDONED") && gameHistory[0].winner !== null ? game["user_" + gameHistory[0].winner] : null,
					nextUser: gameHistory[0].next_player !== null ? game["user_" + gameHistory[0].next_player] : null,
					secondsForNextMove: game.status === "STARTED" && secondsForNextMove > 0 ? secondsForNextMove : null,
					lastTimestamp: game.status === "STARTED" ? gameHistory[0].timestamp : null,
				};

				const Connect4Class = new Connect4(latestGameHistory.board);
				latestGameHistory.board = Connect4Class.board;

				let resp = {
					token: latestGameHistory.token,
					status: latestGameHistory.status,
					user_1_id: latestGameHistory.user_1_id,
					user_1: latestGameHistory.user_1,
					user_2_id: latestGameHistory.user_2_id,
					user_2: latestGameHistory.user_2,
					board: latestGameHistory.board,
					currentPlayer: latestGameHistory.currentPlayer,
					nextPlayer: latestGameHistory.nextPlayer,
					isEnded: latestGameHistory.isEnded,
					isDraw: latestGameHistory.isDraw,
					winner: latestGameHistory.winner,
					winnerUser: latestGameHistory.winnerUser,
					nextUser: latestGameHistory.nextUser,
					secondsForNextMove: latestGameHistory.secondsForNextMove,
					lastTimestamp: latestGameHistory.lastTimestamp,
				};
				resolve(resp);
			} catch (error) {
				reject(error);
			}
		});
	}
}

module.exports = Games;
