class Connect4 {
	constructor(board = null) {
		this.board = {};
		this.numRows = 6;
		this.numCols = 7;
		if (typeof board === "object" && board !== null) {
			this.board = board;
		} else {
			for (let x = 0; x <= this.numRows; x++) {
				this.board[x] = {};
				for (let y = 0; y <= this.numCols; y++) {
					this.board[x][y] = 0;
				}
			}
		}
	}
	isWinner(currentPlayer, currentX, currentY) {
		return this.checkDirection(currentPlayer, currentX, currentY, "vertical") || this.checkDirection(currentPlayer, currentX, currentY, "diagonal") || this.checkDirection(currentPlayer, currentX, currentY, "horizontal");
	}
	isBounds(x, y) {
		return this.board.hasOwnProperty(x) && typeof this.board[x][y] !== "undefined";
	}
	checkDirection(currentPlayer, currentX, currentY, direction) {
		const directions = {
			horizontal: [
				[0, -1],
				[0, 1],
			],
			vertical: [
				[-1, 0],
				[1, 0],
			],
			diagonal: [
				[-1, -1],
				[1, 1],
				[-1, 1],
				[1, -1],
			],
		};
		let chainLength = 1;
		directions[direction].forEach((coords) => {
			let i = 1;
			while (this.isBounds(currentX + coords[0] * i, currentY + coords[1] * i) && this.board[currentX + coords[0] * i][currentY + coords[1] * i] === currentPlayer) {
				chainLength = chainLength + 1;
				i = i + 1;
			}
		});
		return chainLength >= 4;
	}
	makeMove(currentPlayer, x) {
		let resp = {
			player: currentPlayer,
			x: x,
			y: null,
			board: null,
			isWinner: false,
			isEnded: false,
		};

		let nextY = false;
		for (let y = 0; y < this.numRows; y++) {
			if (this.board[x][y] === 0) {
				nextY = y;
				break;
			}
		}

		if (nextY === false) {
			throw new Error("No free spaces in this column. Try another.");
		}

		resp.y = nextY;
		this.board[x][nextY] = currentPlayer;

		if (this.isWinner(currentPlayer, parseInt(x), nextY)) {
			resp.isEnded = true;
			resp.isWinner = true;
			resp.board = this.board;
			return resp;
		}

		let numTurns = 0;
		for (let x = 0; x <= this.numRows; x++) {
			for (let y = 0; y <= this.numCols; y++) {
				if (this.board[x][y] !== 0) {
					numTurns++;
				}
			}
		}

		if (numTurns >= this.numRows * this.numCols) {
			resp.isEnded = true;
			resp.board = this.board;
			return resp;
		}

		resp.board = this.board;
		return resp;
	}
}

module.exports = Connect4;
