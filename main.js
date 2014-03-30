/**
 * 2048
 */

var board = [ // Test board
	[2, 2, 2, 2],
	[2, 0, 4, 0],
	[4, 32, 16, 16],
	[8, 2, 4, 8]
];

var dir = 2; // Direction

drawBoard(board);
for (var i = 0; i < 6; ++i) {
	console.log(board = pushPieces(board, dir).board);
	drawBoard(board);
}

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
	var inRow, outRow, col, outBoard = [], isAMove = false, i, j;
	for (i = 0; i < 4; ++i) {
		inRow = inBoard[i];
		outRow = [];
		col = 0;
		while (col < 4) {
			if (inRow[col] === 0) { // Noop
			} else if (inRow[col + 1] === 0 || inRow[col + 1] === undefined) {
				outRow.push(inRow[col]);
			} else if (inRow[col] === inRow[col + 1]) {
				outRow.push(inRow[col] + inRow[col + 1]);
				col = col + 1;
			} else {
				outRow.push(inRow[col]);
			}
			col = col + 1;
		}
		while (outRow.length < 4) {
			outRow.push(0);
		}
		outBoard[i] = outRow;
		if (isAMove === false) {
			for (j = 0; j < 4; ++j) {
				if (outRow[j] !== inRow[j]) {
					isAMove = true;
				}
			}
		}
	}
	return {
		board: outBoard,
		isAMove: isAMove
	};
};


/**
 * dumbRotate (super dumb bersion)
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

function drawBoard (board) { // Temp
	var i, j, $board = $("<div></div>").addClass("board");
	for (i = 0; i < 4; ++i) {
		for (j = 0; j < 4; ++j) {
			$board.append($("<div>" + board[i][j] + "</div>"));
		}
	}
	$("body").append($board);
}