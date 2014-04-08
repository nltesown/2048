/**
 * 2048
 */

var board = [
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0],
	[0, 0, 0, 0]
];

(function init () {
	var dir, result;

	drawEmptyBoard();
	placeRandomPiece(board);
	placeRandomPiece(board);

	$(document).on("keydown", function (e) {
		if (e.keyCode === 37) {
			dir = 3;
		} else if (e.keyCode === 40) {
			dir = 2;
		} else if (e.keyCode === 39) {
			dir = 1;
		} else if (e.keyCode === 38) {
			dir = 0;
		} else {
			dir = null;
		}
		if (dir !== null) {
			result = pushPieces(board, dir);
			board = result.board;
			drawBoard(board);
			if (result.isAMove) {
				placeRandomPiece(board);
			}
		}
	});
}());

/**
 * pushPieces (in the given direction)
 * direction: 0-left, 1-bottom, 2-right, 3-up (equals the number of necessary internal board rotations!)
 */
function pushPieces (board, direction) {
	board = pushPiecesToLeft(dumbRotate(board, direction)); // Rotate and push left
	return {
		board: dumbRotate(board.board, -direction), // Rotate back
		isAMove: board.isAMove
	}
}

/**
 * pushPiecesToLeft
 */
function pushPiecesToLeft (inBoard) {
	var inRow, outRow1, outRow2, col, outBoard = [], isAMove = false, i, j;
	for (i = 0; i < 4; ++i) {
		inRow = inBoard[i];
		outRow1 = [];
		outRow2 = [];

		col = 0; // First iteration: push
		while (col < 4) {
			if (inRow[col] !== 0) {
				outRow1.push(inRow[col]);
			}
			col = col + 1;
		}
		while (outRow1.length < 4) { // Right pad with 0s
			outRow1.push(0);
		}

		col = 0; // Second iteration: add pairs
		while (col < 4) {
			if (outRow1[col] === outRow1[col + 1]) {
				outRow2.push(outRow1[col] + outRow1[col + 1]);
				col = col + 1
			} else {
				outRow2.push(outRow1[col]);
			}
			col = col + 1;
		}
		while (outRow2.length < 4) { // Right pad with 0s
			outRow2.push(0);
		}
		outBoard[i] = outRow2;
		if (isAMove === false) {
			for (j = 0; j < 4; ++j) {
				if (outRow2[j] !== inRow[j]) {
					isAMove = true;
				}
			}
		}
	}

	if (isAMove === false && findEmptyCells(outBoard).length === 0) {
		$(document).off("keydown");
		alert("You lose!");
	}

	return {
		board: outBoard,
		isAMove: isAMove
	};
};


/**
 * dumbRotate (super dumb version)
 */
function dumbRotate(board, times) { // -3 <= times <= 3
	var rotatedBoard, i;
	if (times < 0) { // Here we deal with negative (i.e. counterclockwise) rotations: we turn them into clockwise rotations
		times = 4 + times;
	}
	for (i = 0; i < times; ++i) {
		rotatedBoard = [
			[board[3][0], board[2][0], board[1][0], board[0][0]],
			[board[3][1], board[2][1], board[1][1], board[0][1]],
			[board[3][2], board[2][2], board[1][2], board[0][2]],
			[board[3][3], board[2][3], board[1][3], board[0][3]]
		];
		board = rotatedBoard;
	}
	return board;
}

function findEmptyCells (board) {
	var i, j, emptyCells = [];
	for (i = 0; i < 4; ++i) {
		for (j = 0; j < 4; ++j) {
			if (board[i][j] === 0) {
				emptyCells.push([i, j]);
			}
		}
	}
	return emptyCells;
}


function placeRandomPiece (board) {
	var emptyCells = findEmptyCells(board),
		random = Math.floor(emptyCells.length * Math.random()),
		pos = emptyCells[random];
		board[pos[0]][pos[1]] = (random < 1 ? 4 : 2); // New piece's value: 2 or 4?

	drawBoard(board, [pos[0], pos[1]]);
}


function drawBoard (board, newPiece) {
	newPiece = newPiece || [];
	var i, j, $cell, $board = $(".board");
	for (i = 0; i < 4; ++i) {
		for (j = 0; j < 4; ++j) {
			$cell = $(".board").children("div").eq(j * 4 + i);
			if (board[i][j] !== 0) {
				if (newPiece[0] === i && newPiece[1] === j) {
					$cell.hide().fadeIn(350);
				}
				$cell.attr("class", "c" + board[i][j]).html(board[i][j]);
			} else {
				$cell.attr("class", null).empty();
			}
		}
	}
}

function drawEmptyBoard () {
	var i, j, $board = $("<div></div>").addClass("board");
	for (i = 0; i < 4; ++i) {
		for (j = 0; j < 4; ++j) {
			$board.append($("<div></div>"));
		}
	}
	$("body").append($board);
}