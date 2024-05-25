import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { GamePlayState } from "../rooms/schema/GameState";

export class RoundOverCommand extends Command<GameRoom,{ winnerSessionId: string }> {
  execute({ winnerSessionId } = this.payload) {
    this.state.players.get(winnerSessionId).numWins++;
    this.state.lastRoundWinner = this.state.players.get(winnerSessionId).idx;
    this.state.playState = GamePlayState.ROUND_OVER;
    this.clock.setTimeout(
      () => {
        this.state.resetToNextRound()
      },
      20_000
    );
  }
}
