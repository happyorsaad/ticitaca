import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { GamePlayState } from "../rooms/schema/GameState";

export class OnConsentedLeaveCommand extends Command<GameRoom,{ sessionId: string }> {
  execute({ sessionId } = this.payload) {
    if (this.state.playState == GamePlayState.WAITING) {
      this.state.players.delete(sessionId);
    }
    this.state.players.get(sessionId).hasLeft = true;
  }
}
