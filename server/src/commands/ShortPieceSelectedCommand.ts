import { Command } from "@colyseus/command";
import { GamePlayState, PieceType, Player } from "../rooms/schema/GameState";
import { GameRoom } from "../rooms/GameRoom";

export class ShortPieceSelectedCommand extends Command<GameRoom,{ sessionId: string; idx: number }> {
  validate({ sessionId, idx } = this.payload) {
    if(!(this.state.playState === GamePlayState.PLAYER_CHOOSING_SMALL_PIECE_TO_UPGRADE))
      return false;
    let player = this.state.players.get(sessionId);
    if (player.idx !== this.state.currentTurn)
      return false;
    if(player.idx == 0 && this.state.board[idx] != PieceType.SMALL_0)
      return false;
    if(player.idx == 1 && this.state.board[idx] != PieceType.SMALL_1)
      return false;
    return true;
  }

  execute({ sessionId, idx } = this.payload) {
    this.state.board[idx] = PieceType.NO_PIECE;
    this.state.players.get(sessionId).numOfLargePieces++;
    this.state.playState = GamePlayState.RUNNING;
    this.state.currentTurn = this.state.currentTurn == 0 ? 1 : 0;
  }
}
