import { Command } from "@colyseus/command";
import { GamePlayState, PieceType, Player } from "../rooms/schema/GameState";
import { GameRoom } from "../rooms/GameRoom";
import { RoundOverCommand } from "./RoundOverCommand";
import { ChooseSmallPieceToUpgradeCommand } from "./ChooseSmallPieceToUpgradeCommand";
import { ChooseSmallPieceRowCommand } from "./ChooseSmallPieceRowCommand";

export class PlayMoveCommand extends Command<GameRoom,{ sessionId: string; pieceType: number; location: number }> {
  private BOARD_SIZE = 6;
  private board2d: number[][] = [];

  private moveDirections: any = [
    { row: -1, col: 0, boop_row: -2, boop_col: 0 },
    { row: 1, col: 0, boop_row: 2, boop_col: 0 },
    { row: 0, col: -1, boop_row: 0, boop_col: -2 },
    { row: 0, col: 1, boop_row: 0, boop_col: 2 },
    { row: -1, col: -1, boop_row: -2, boop_col: -2 },
    { row: -1, col: 1, boop_row: -2, boop_col: 2 },
    { row: 1, col: -1, boop_row: 2, boop_col: -2 },
    { row: 1, col: 1, boop_row: 2, boop_col: 2 },
  ];

  validate({ sessionId } = this.payload) {
    if(this.state.playState !== GamePlayState.RUNNING)
      return false;
    
    var player = this.state.players.get(sessionId);

    if(player.idx !== this.state.currentTurn){
      return false;
    }
    
    if(this.payload.location < 0 || this.payload.location > this.state.board.length) {
      return false;
    }
    
    
    if(this.state.board[this.payload.location] !== PieceType.NO_PIECE) {
      return false;
    }
    
    
    if(!this.isValidPiece(player.idx, this.payload.pieceType)){
      return false;
    }
    
    return true;
  }

  isValidPiece(playerIdx: number, pieceType: number){
    if(playerIdx === 0) {
      return pieceType === PieceType.SMALL_0 || pieceType === PieceType.LARGE_0;
    }
    return pieceType === PieceType.SMALL_1 || pieceType === PieceType.LARGE_1;  
  }

  execute({ sessionId, pieceType, location } = this.payload) {
    this.playMove(sessionId, pieceType, location);  
  }

  playMove(sessionId: string, pieceType: number, location: number){
    this.room.broadcast("player_move", { 
      "playerIdx" : this.state.players.get(sessionId).idx,
      "pieceType" : pieceType,
      "location" : location
    });
    console.log("play move", sessionId, pieceType, location)
    this.state.board[location] = pieceType;
    this.boop(location, pieceType);
    this.state.currentTurn = this.state.currentTurn === 0 ? 1 : 0;
  }

  private boop(location: number, pieceType: number){
    
    this.decreasePieceCounts(pieceType);
    
    this.copyBoardTo2d();
    
    console.log(this.board2d);
    
    this.moveDirections.forEach((direction: any) => {
      this.boopInDirection(location, pieceType, direction);
    });
    
    this.collectPiecesMovedOutOfBoard();
    
    var matches = this.checkThreeInRowColumnOrDiagonal(this.board2d);
    var winner = this.checkWinner(matches, this.board2d);
    if(winner !== -1){
      console.log("winner is " + winner);
      this.room.dispatcher.dispatch(new RoundOverCommand(), {
        winnerSessionId: this.state.indexToSessinId[winner]
      });
    }
    
    this.checkSmallPieceMatches(matches);
    this.checkAllPiecesArePlacedOnBoard(this.board2d);
    this.copy2dToBoard();
  }

  private checkAllPiecesArePlacedOnBoard(board2d: number[][]){
    var playerZeroPieces = 0;
    for(var row = 2; row < this.BOARD_SIZE + 2; row++){
      for(var col = 2; col < this.BOARD_SIZE + 2; col++){
        if(board2d[row][col] === PieceType.SMALL_0 || board2d[row][col] === PieceType.LARGE_0){
          playerZeroPieces++;
        }
      }
    }

    var playerOnePieces = 0;
    for(var row = 2; row < this.BOARD_SIZE + 2; row++){
      for(var col = 2; col < this.BOARD_SIZE + 2; col++){
        if(board2d[row][col] === PieceType.SMALL_1 || board2d[row][col] === PieceType.LARGE_1){
          playerOnePieces++;
        }
      }
    }
    
    if(playerZeroPieces === 8){
      this.room.dispatcher.dispatch(new ChooseSmallPieceToUpgradeCommand(), {
        sessionId: this.state.indexToSessinId[0],
        matches: []
      });
    }

    if(playerOnePieces === 8){
      this.room.dispatcher.dispatch(new ChooseSmallPieceToUpgradeCommand(), {
        sessionId: this.state.indexToSessinId[1],
        matches: []
      });
    }
  }

  private checkSmallPieceMatches(matches: any[]){

    let smallPieceMatches = matches.filter((match: any) => {
      return match["pieces"][0] === match["pieces"][1] 
             && match["pieces"][1] === match["pieces"][2] 
             && (
                  match["pieces"][0] === PieceType.SMALL_0 || match["pieces"][0] === PieceType.SMALL_1
            );
    });

    if(smallPieceMatches.length === 0){
      return;
    }

    if(smallPieceMatches.length === 1){
      if(smallPieceMatches[0]["pieces"][0] === PieceType.SMALL_0){
        this.state.players.get(this.state.indexToSessinId[0]).numOfLargePieces += 3;
        smallPieceMatches[0]["locations"].forEach((location: any) => {
          this.board2d[location[0]][location[1]] = PieceType.NO_PIECE;
        });
      } else if(smallPieceMatches[0]["pieces"][0] === PieceType.SMALL_1){
        this.state.players.get(this.state.indexToSessinId[1]).numOfLargePieces += 3;
        smallPieceMatches[0]["locations"].forEach((location: any) => {
          this.board2d[location[0]][location[1]] = PieceType.NO_PIECE;
        });
      }

      return;
    }

    this.room.dispatcher.dispatch(new ChooseSmallPieceRowCommand(), {
      sessionId: this.state.indexToSessinId[this.state.currentTurn],
      matches: smallPieceMatches
    });
  }  

  private checkWinner(matches: any[], board2d: number[][]){
    // check if all large pieces have been placed on board
    if(this.state.players.get(this.state.indexToSessinId[this.state.currentTurn]).numOfLargePieces === 0){
      if(this.state.players.get(this.state.indexToSessinId[this.state.currentTurn]).numOfSmallPieces === 0)
        return this.state.currentTurn;
    }

    // check if there are three large pieces in a row, column or diagonal
    var winners: Array<number> = [];
    matches.forEach((match: any) => {
      if(match["pieces"][0] === match["pieces"][1] && match["pieces"][1] === match["pieces"][2]){
        if(match["pieces"][0] === PieceType.LARGE_0){
          winners.push(0);
        } else if(match["pieces"][0] === PieceType.LARGE_1){
          winners.push(1);
        }
      }
    });

    console.log(winners);
    console.log(matches);

    if(winners.length === 0){
      return -1;
    }

    if(winners.length === 1){
      return winners[0];
    }

    if(winners.length === 2){
      return this.state.currentTurn;
    }

    return -1;
  }

  private copyBoardTo2d(){
    for(var row = 0; row < this.BOARD_SIZE + 4; row++){
      this.board2d[row] = new Array(this.BOARD_SIZE + 4).fill(PieceType.NO_PIECE);
    }

    for(var row = 0; row < this.BOARD_SIZE; row++){
      for(var col = 0; col < this.BOARD_SIZE; col++){
        this.board2d[row + 2][col + 2] = this.state.board[row * this.BOARD_SIZE + col];
      }
    }
  }

  private copy2dToBoard(){
    for(var row = 0; row < this.BOARD_SIZE; row++){
      for(var col = 0; col < this.BOARD_SIZE; col++){
        this.state.board[row * this.BOARD_SIZE + col] = this.board2d[row + 2][col + 2];
      }
    }
  }

  private checkThreeInRowColumnOrDiagonal(board2d: number[][]){
    var matches :any = []
    
    var threeInRow = this.checkThreeInRow(board2d);
    matches = matches.concat(threeInRow);

    var threeInColumn = this.checkThreeInColumn(board2d);
    matches = matches.concat(threeInColumn);

    var threeInDiagonal = this.checkThreeInDiagonal(board2d);
    matches = matches.concat(threeInDiagonal);

    return matches;
  }

  checkThreeInRow(board2d: number[][]){
    let matches: any = [];
    
    for(var row = 2; row < this.BOARD_SIZE + 2; row++){
      for(var col = 2; col < this.BOARD_SIZE + 2; col++){
        if(board2d[row][col] !== PieceType.NO_PIECE){
          if(board2d[row][col+1] !== PieceType.NO_PIECE){
            if(board2d[row][col+2] !== PieceType.NO_PIECE){
              matches.push({
                "locations": [[row, col], [row, col+1], [row, col+2]],
                "pieces": [board2d[row][col], board2d[row][col+1], board2d[row][col+2]]
              });
            }
          }
        }
      }
    }

    return matches;
  }

  checkThreeInColumn(board2d: number[][]){
    var matches: any = [];
    for(var col = 2; col < this.BOARD_SIZE + 2; col++){
      for(var row = 2; row < this.BOARD_SIZE + 2; row++){
        if(board2d[row][col] !== PieceType.NO_PIECE){
          if(board2d[row+1][col] !== PieceType.NO_PIECE){
            if(board2d[row+2][col] !== PieceType.NO_PIECE){
              matches.push({
                "locations": [[row, col], [row+1, col], [row+2, col]],
                "pieces": [board2d[row][col], board2d[row+1][col], board2d[row+2][col]]
              });
            }
          }
        }
      }
    }
    return matches;
  }

  checkThreeInDiagonal(board2d: number[][]){
    var matches: any = [];
    for(var col = 2; col < this.BOARD_SIZE + 2; col++){
      for(var row = 2; row < this.BOARD_SIZE + 2; row++){
        if(board2d[row][col] !== PieceType.NO_PIECE){
          if(board2d[row+1][col+1] !== PieceType.NO_PIECE){
            if(board2d[row-1][col-1] !== PieceType.NO_PIECE){
              matches.push({
                "locations": [[row, col], [row+1, col+1], [row-1, col-1]],
                "pieces": [board2d[row][col], board2d[row+1][col+1], board2d[row-1][col-1]]
              });
            }
          }
          if(board2d[row-1][col+1] !== PieceType.NO_PIECE){
            if(board2d[row+1][col-1] !== PieceType.NO_PIECE){
              matches.push({
                "locations": [[row, col], [row-1, col+1], [row+1, col-1]],
                "pieces": [board2d[row][col], board2d[row-1][col+1], board2d[row+1][col-1]]
              });
            }
          }
        }
      }
    }
    return matches;
  }

  private boopInDirection(location: number, pieceType: number, direction: any){
    var row = Math.floor(location / this.BOARD_SIZE) + 2;
    var col = location % this.BOARD_SIZE + 2;
    
    var newRow = row + direction.row;
    var newCol = col + direction.col;
    var boopRow = row + direction.boop_row;
    var boopCol = col + direction.boop_col;

    if(this.isLargePiece(pieceType)){
      console.log("large piece");
      console.log(this.board2d);

      var pieceToMove = this.board2d[newRow][newCol];
      var pieceToBoop = this.board2d[boopRow][boopCol];
      
      if(pieceToBoop === PieceType.NO_PIECE && pieceToMove !== PieceType.NO_PIECE){
        this.board2d[newRow][newCol] = PieceType.NO_PIECE;
        this.board2d[boopRow][boopCol] = pieceToMove;
      }

    } else {
      var pieceToMove = this.board2d[newRow][newCol];
      var pieceToBoop = this.board2d[boopRow][boopCol];
      
      if(!this.isLargePiece(pieceToMove) && pieceToBoop === PieceType.NO_PIECE && pieceToMove !== PieceType.NO_PIECE){
        this.board2d[newRow][newCol] = PieceType.NO_PIECE;
        this.board2d[boopRow][boopCol] = pieceToMove;
      }

    }
  }


  private isLargePiece(pieceType: number){
    return pieceType === PieceType.LARGE_0 || pieceType === PieceType.LARGE_1;
  }

  private collectPiecesMovedOutOfBoard(){
    // first two rows
    for(var row = 0; row < 2; row++){
      for(var col = 0; col < this.BOARD_SIZE + 4; col++){
        var piece = this.board2d[row][col];
        this.updatePieceCounts(piece);
        this.board2d[row][col] = PieceType.NO_PIECE;
      }
    }

    // last two rows
    for(var row = this.BOARD_SIZE + 2; row < this.BOARD_SIZE + 4; row++){
      for(var col = 0; col < this.BOARD_SIZE + 4; col++){
        var piece = this.board2d[row][col];
        this.updatePieceCounts(piece);
        this.board2d[row][col] = PieceType.NO_PIECE;
      }
    }

    // first two columns
    for(var row = 0; row < this.BOARD_SIZE + 4; row++){
      for(var col = 0; col < 2; col++){
        var piece = this.board2d[row][col];
        this.updatePieceCounts(piece);
        this.board2d[row][col] = PieceType.NO_PIECE;
      }
    }

    // last two columns
    for(var row = 0; row < this.BOARD_SIZE + 4; row++){
      for(var col = this.BOARD_SIZE + 2; col < this.BOARD_SIZE + 4; col++){
        var piece = this.board2d[row][col];
        this.updatePieceCounts(piece);
        this.board2d[row][col] = PieceType.NO_PIECE;
      }
    }
  }

  private updatePieceCounts(piece: number) {
    switch (piece) {
      case PieceType.LARGE_0:
        this.state.players.get(this.state.indexToSessinId[0]).numOfLargePieces++;
        break;
      case PieceType.LARGE_1:
        this.state.players.get(this.state.indexToSessinId[1]).numOfLargePieces++;
        break;
      case PieceType.SMALL_0:
        this.state.players.get(this.state.indexToSessinId[0]).numOfSmallPieces++;
        break;
      case PieceType.SMALL_1:
        this.state.players.get(this.state.indexToSessinId[1]).numOfSmallPieces++;
        break;
    }
  }

  private decreasePieceCounts(piece: number){ {
    switch (piece) {
      case PieceType.LARGE_0:
        this.state.players.get(this.state.indexToSessinId[0]).numOfLargePieces--;
        break;
      case PieceType.LARGE_1:
        this.state.players.get(this.state.indexToSessinId[1]).numOfLargePieces--;
        break;
      case PieceType.SMALL_0:
        this.state.players.get(this.state.indexToSessinId[0]).numOfSmallPieces--;
        break;
      case PieceType.SMALL_1:
        this.state.players.get(this.state.indexToSessinId[1]).numOfSmallPieces--;
        break;
    }
  }
  }
}
