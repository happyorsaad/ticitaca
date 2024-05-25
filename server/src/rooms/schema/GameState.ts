import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export enum GamePlayState {
  RUNNING = 0,
  WAITING,
  PLAYER_DISCONNECTED,
  ROUND_OVER,
  GAME_OVER,
  PLAYER_CHOOSING_SMALL_PIECE_ROW_TO_UPGRADE,
  PLAYER_CHOOSING_SMALL_PIECE_TO_UPGRADE,
}

export enum MessageCodes {
  PLAY_TURN = 0
}

export enum PieceType {
  SMALL_0,
  LARGE_0,
  SMALL_1,
  LARGE_1,
  NO_PIECE, 
}

export class Player extends Schema {
  @type("string") id = "";
  @type("string") name = "";
  @type("uint8") idx = 0;
  @type("boolean") isConnected: boolean;
  @type("boolean") hasLeft: boolean;
  @type("uint8") numWins: number = 0;
  @type("uint8") numOfSmallPieces: number = 8;
  @type("uint8") numOfLargePieces: number = 0;
  
  isOwner: boolean = false;

  constructor(id: string, name: string, idx: number) {
    super();
    this.id = id;
    this.name = name || id;
    this.idx = idx;
    this.isConnected = true;
    this.hasLeft = false;
  }
}

export class GameState extends Schema {
  
  @type("int8") currentTurn = 0;  
  @type({ map: Player }) players = new MapSchema<Player>();
  @type(["uint8"]) board = new ArraySchema<number>();
  @type("uint8") playState = GamePlayState.WAITING;
  @type("int8") lastRoundWinner = -1;
  
  
  BOARD_SIZE = 6;
  indexToSessinId: any = {};

  constructor() {
    super();
    this.resetBoard();
  }

  resetToNextRound() {
    console.log("resetting to next round");
    this.playState = GamePlayState.RUNNING;
    this.resetBoard();
    this.currentTurn = 0;
    this.lastRoundWinner = -1;
    
    this.players.forEach((player, sessionId) => {
      console.log("resetting player: ", player.name);
      player.numOfLargePieces = 0;
      player.numOfSmallPieces = 8;
    });

  }
  
  private resetBoard() {
    this.board = new ArraySchema<number>();
    for(var row = 0; row < this.BOARD_SIZE; row++){
      for(var col = 0; col < this.BOARD_SIZE; col++){
        this.board.push(PieceType.NO_PIECE);
      }
    }
  }
}
