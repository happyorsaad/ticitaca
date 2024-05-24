import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";

export class ReconnectPlayerCommand extends Command<GameRoom,{ sessionId: string }> {
  execute({ sessionId } = this.payload) {
    let player = this.state.players.get(sessionId);
    player.isConnected = true;
  }
}
