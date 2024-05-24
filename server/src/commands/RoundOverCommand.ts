import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { GamePlayState } from "../rooms/schema/GameState";

export class RoundOverCommand extends Command<GameRoom,{ sessionId: string }> {
  execute({ sessionId } = this.payload) {
    this.state.players.get(sessionId).numWins++;
    this.state.playState = GamePlayState.ROUND_OVER;
    this.clock.setTimeout(
      () => {
        this.state.resetToNextRound()
      },
      5_000
    );
  }
}
