import { Command } from "@colyseus/command";
import { GamePlayState, Player } from "../rooms/schema/GameState";
import { GameRoom } from "../rooms/GameRoom";

export class ChooseSmallPieceRowCommand extends Command<GameRoom,{ sessionId: string; matches: any[] }> {
  validate({ sessionId } = this.payload) {
    return this.state.playState === GamePlayState.RUNNING;
  }

  execute({ sessionId, matches } = this.payload) {
    this.state.playState = GamePlayState.PLAYER_CHOOSING_SMALL_PIECE_ROW_TO_UPGRADE;
  }
}
