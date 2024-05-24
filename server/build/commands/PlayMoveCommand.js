"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayMoveCommand = void 0;
const command_1 = require("@colyseus/command");
const GameState_1 = require("../rooms/schema/GameState");
class PlayMoveCommand extends command_1.Command {
    constructor() {
        super(...arguments);
        this.BOARD_SIZE = 6;
        this.board2d = [];
        this.moveDirections = [
            { row: -1, col: 0, boop_row: -2, boop_col: 0 },
            { row: 1, col: 0, boop_row: 2, boop_col: 0 },
            { row: 0, col: -1, boop_row: 0, boop_col: -2 },
            { row: 0, col: 1, boop_row: 0, boop_col: 2 },
            { row: -1, col: -1, boop_row: -2, boop_col: -2 },
            { row: -1, col: 1, boop_row: -2, boop_col: 2 },
            { row: 1, col: -1, boop_row: 2, boop_col: -2 },
            { row: 1, col: 1, boop_row: 2, boop_col: 2 },
        ];
    }
    validate({ sessionId } = this.payload) {
        if (this.state.playState !== GameState_1.GamePlayState.RUNNING)
            return false;
        var player = this.state.players.get(sessionId);
        if (player.idx !== this.state.currentTurn) {
            return false;
        }
        if (this.payload.location < 0 || this.payload.location > this.state.board.length) {
            return false;
        }
        if (this.state.board[this.payload.location] !== GameState_1.PieceType.NO_PIECE) {
            return false;
        }
        if (!this.isValidPiece(player.idx, this.payload.pieceType)) {
            return false;
        }
        return true;
    }
    isValidPiece(playerIdx, pieceType) {
        if (playerIdx === 0) {
            return pieceType === GameState_1.PieceType.SMALL_0 || pieceType === GameState_1.PieceType.LARGE_0;
        }
        return pieceType === GameState_1.PieceType.SMALL_1 || pieceType === GameState_1.PieceType.LARGE_1;
    }
    execute({ sessionId, pieceType, location } = this.payload) {
        this.playMove(sessionId, pieceType, location);
    }
    playMove(sessionId, pieceType, location) {
        this.boop(location, pieceType);
        this.state.currentTurn = this.state.currentTurn === 0 ? 1 : 0;
    }
    boop(location, pieceType) {
        this.state.board[location] = pieceType;
        this.decreasePieceCounts(pieceType);
        this.copyBoardTo2d();
        console.log(this.board2d);
        this.moveDirections.forEach((direction) => {
            this.boopInDirection(location, pieceType, direction);
        });
        this.collectPiecesMovedOutOfBoard();
        var winner = this.checkThreeInRowColumnOrDiagonal();
        if (winner !== -1) {
            this.state.players.get(this.state.indexToSessinId[winner]).numWins++;
            this.state.playState = GameState_1.GamePlayState.ROUND_OVER;
        }
        this.copy2dToBoard();
    }
    copyBoardTo2d() {
        for (var row = 0; row < this.BOARD_SIZE + 4; row++) {
            this.board2d[row] = new Array(this.BOARD_SIZE + 4).fill(GameState_1.PieceType.NO_PIECE);
        }
        for (var row = 0; row < this.BOARD_SIZE; row++) {
            for (var col = 0; col < this.BOARD_SIZE; col++) {
                this.board2d[row + 2][col + 2] = this.state.board[row * this.BOARD_SIZE + col];
            }
        }
    }
    copy2dToBoard() {
        for (var row = 0; row < this.BOARD_SIZE; row++) {
            for (var col = 0; col < this.BOARD_SIZE; col++) {
                this.state.board[row * this.BOARD_SIZE + col] = this.board2d[row + 2][col + 2];
            }
        }
    }
    checkThreeInRowColumnOrDiagonal() {
        var threeInRow = this.checkThreeInRow();
        if (threeInRow !== -1) {
            return threeInRow;
        }
        var threeInColumn = this.checkThreeInColumn();
        if (threeInColumn !== -1) {
            return threeInColumn;
        }
        var threeInDiagonal = this.checkThreeInDiagonal();
        if (threeInDiagonal !== -1) {
            return threeInDiagonal;
        }
        return -1;
    }
    checkThreeInRow() {
        for (var row = 0; row < this.BOARD_SIZE; row++) {
            var threeInRow = true;
            var firstPiece = this.board2d[row + 2][2];
            for (var col = 3; col < this.BOARD_SIZE + 2; col++) {
                if (this.board2d[row + 2][col] !== firstPiece) {
                    threeInRow = false;
                    break;
                }
            }
            if (threeInRow && firstPiece !== GameState_1.PieceType.NO_PIECE) {
                if (firstPiece === GameState_1.PieceType.LARGE_0) {
                    return 0;
                }
                else {
                    return 1;
                }
            }
        }
        return -1;
    }
    checkThreeInColumn() {
        for (var col = 0; col < this.BOARD_SIZE; col++) {
            var threeInColumn = true;
            var firstPiece = this.board2d[2][col + 2];
            for (var row = 3; row < this.BOARD_SIZE + 2; row++) {
                if (this.board2d[row][col + 2] !== firstPiece) {
                    threeInColumn = false;
                    break;
                }
            }
            if (threeInColumn && firstPiece !== GameState_1.PieceType.NO_PIECE) {
                if (firstPiece === GameState_1.PieceType.LARGE_0) {
                    return 0;
                }
                else {
                    return 1;
                }
            }
        }
        return -1;
    }
    checkThreeInDiagonal() {
        var threeInDiagonal = true;
        var firstPiece = this.board2d[2][2];
        for (var i = 0; i < this.BOARD_SIZE; i++) {
            if (this.board2d[i + 2][i + 2] !== firstPiece) {
                threeInDiagonal = false;
                break;
            }
        }
        if (threeInDiagonal && firstPiece !== GameState_1.PieceType.NO_PIECE) {
            if (firstPiece === GameState_1.PieceType.LARGE_0) {
                return 0;
            }
            else {
                return 1;
            }
        }
        threeInDiagonal = true;
        firstPiece = this.board2d[2][this.BOARD_SIZE + 1];
        for (var i = 0; i < this.BOARD_SIZE; i++) {
            if (this.board2d[i + 2][this.BOARD_SIZE - i + 1] !== firstPiece) {
                threeInDiagonal = false;
                break;
            }
        }
        if (threeInDiagonal && firstPiece !== GameState_1.PieceType.NO_PIECE) {
            if (firstPiece === GameState_1.PieceType.LARGE_0) {
                return 0;
            }
            else {
                return 1;
            }
        }
        return -1;
    }
    boopInDirection(location, pieceType, direction) {
        var row = Math.floor(location / this.BOARD_SIZE) + 2;
        var col = location % this.BOARD_SIZE + 2;
        var newRow = row + direction.row;
        var newCol = col + direction.col;
        var boopRow = row + direction.boop_row;
        var boopCol = col + direction.boop_col;
        if (this.isLargePiece(pieceType)) {
            console.log("large piece");
            console.log(this.board2d);
            var pieceToMove = this.board2d[newRow][newCol];
            var pieceToBoop = this.board2d[boopRow][boopCol];
            if (pieceToBoop === GameState_1.PieceType.NO_PIECE && pieceToMove !== GameState_1.PieceType.NO_PIECE) {
                this.board2d[newRow][newCol] = GameState_1.PieceType.NO_PIECE;
                this.board2d[boopRow][boopCol] = pieceToMove;
            }
        }
        else {
            var pieceToMove = this.board2d[newRow][newCol];
            var pieceToBoop = this.board2d[boopRow][boopCol];
            if (!this.isLargePiece(pieceToMove) && pieceToBoop !== GameState_1.PieceType.NO_PIECE && pieceToMove !== GameState_1.PieceType.NO_PIECE) {
                this.board2d[newRow][newCol] = pieceToBoop;
                this.board2d[boopRow][boopCol] = GameState_1.PieceType.NO_PIECE;
            }
        }
    }
    isLargePiece(pieceType) {
        return pieceType === GameState_1.PieceType.LARGE_0 || pieceType === GameState_1.PieceType.LARGE_1;
    }
    collectPiecesMovedOutOfBoard() {
        // first two rows
        for (var row = 0; row < 2; row++) {
            for (var col = 0; col < this.BOARD_SIZE + 4; col++) {
                var piece = this.board2d[row][col];
                this.updatePieceCounts(piece);
                this.board2d[row][col] = GameState_1.PieceType.NO_PIECE;
            }
        }
        // last two rows
        for (var row = this.BOARD_SIZE + 2; row < this.BOARD_SIZE + 4; row++) {
            for (var col = 0; col < this.BOARD_SIZE + 4; col++) {
                var piece = this.board2d[row][col];
                this.updatePieceCounts(piece);
                this.board2d[row][col] = GameState_1.PieceType.NO_PIECE;
            }
        }
        // first two columns
        for (var row = 0; row < this.BOARD_SIZE + 4; row++) {
            for (var col = 0; col < 2; col++) {
                var piece = this.board2d[row][col];
                this.updatePieceCounts(piece);
                this.board2d[row][col] = GameState_1.PieceType.NO_PIECE;
            }
        }
        // last two columns
        for (var row = 0; row < this.BOARD_SIZE + 4; row++) {
            for (var col = this.BOARD_SIZE + 2; col < this.BOARD_SIZE + 4; col++) {
                var piece = this.board2d[row][col];
                this.updatePieceCounts(piece);
                this.board2d[row][col] = GameState_1.PieceType.NO_PIECE;
            }
        }
    }
    updatePieceCounts(piece) {
        switch (piece) {
            case GameState_1.PieceType.LARGE_0:
                this.state.players.get(this.state.indexToSessinId[0]).numOfLargePieces++;
                break;
            case GameState_1.PieceType.LARGE_1:
                this.state.players.get(this.state.indexToSessinId[1]).numOfLargePieces++;
                break;
            case GameState_1.PieceType.SMALL_0:
                this.state.players.get(this.state.indexToSessinId[0]).numOfSmallPieces++;
                break;
            case GameState_1.PieceType.SMALL_1:
                this.state.players.get(this.state.indexToSessinId[1]).numOfSmallPieces++;
                break;
        }
    }
    decreasePieceCounts(piece) {
        {
            switch (piece) {
                case GameState_1.PieceType.LARGE_0:
                    this.state.players.get(this.state.indexToSessinId[0]).numOfLargePieces--;
                    break;
                case GameState_1.PieceType.LARGE_1:
                    this.state.players.get(this.state.indexToSessinId[1]).numOfLargePieces--;
                    break;
                case GameState_1.PieceType.SMALL_0:
                    this.state.players.get(this.state.indexToSessinId[0]).numOfSmallPieces--;
                    break;
                case GameState_1.PieceType.SMALL_1:
                    this.state.players.get(this.state.indexToSessinId[1]).numOfSmallPieces--;
                    break;
            }
        }
    }
}
exports.PlayMoveCommand = PlayMoveCommand;
//# sourceMappingURL=PlayMoveCommand.js.map