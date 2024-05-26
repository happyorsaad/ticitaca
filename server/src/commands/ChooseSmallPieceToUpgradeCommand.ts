import { Command } from "@colyseus/command";
import { GamePlayState, Player } from "../rooms/schema/GameState";
import { GameRoom } from "../rooms/GameRoom";

export class ChooseSmallPieceToUpgradeCommand extends Command<GameRoom,{ sessionId: string; matches: any[] }> {
  validate({ sessionId } = this.payload) {
    console.log("ChooseSmallPieceToUpgradeCommand validate");
    if(!(this.state.playState === GamePlayState.RUNNING))
      return false;

    let playerIdx = this.state.players.get(sessionId).idx;
    if(playerIdx !== this.state.currentTurn)
      return false;
    
    return true;
  }

  execute({ sessionId, matches } = this.payload) {
    console.log("ChooseSmallPieceToUpgradeCommand execute");
    this.state.playState = GamePlayState.PLAYER_CHOOSING_SMALL_PIECE_TO_UPGRADE;
  }
}
