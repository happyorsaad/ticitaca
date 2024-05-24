import { Command } from "@colyseus/command";
import { GamePlayState, Player } from "../rooms/schema/GameState";
import { GameRoom } from "../rooms/GameRoom";

export class JoinGameCommand extends Command<GameRoom,{ sessionId: string; name: string }> {
  validate({ sessionId } = this.payload) {
    return (
      this.state.players.size < this.room.maxClients &&
      !this.state.players.has(sessionId)
    );
  }

  execute({ sessionId, name } = this.payload) {
    const playerIdx = this.state.players.size;
    this.state.indexToSessinId[playerIdx] = sessionId;
    this.state.players.set(sessionId, new Player(sessionId, name, playerIdx));

    if(this.state.players.size === this.room.maxClients){
      this.state.playState = GamePlayState.RUNNING;
    }
  }
}
