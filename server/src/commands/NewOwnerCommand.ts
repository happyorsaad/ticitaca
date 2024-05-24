import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";

export class NewOwnerCommand extends Command<GameRoom,{ lastOwnerId: string }> {
  execute({ lastOwnerId } = this.payload) {
    if (this.state.players.get(lastOwnerId).isConnected)
      // owner returned
      return;

    let newOwner: string;
    this.state.players.forEach((player, id) => {
      if (player.isConnected) newOwner = id;
    });

    if (newOwner) {
      this.state.players.get(newOwner).isOwner = true;
      this.state.players.get(lastOwnerId).isOwner = false;
    } else {
      console.log("no new owner found, disconnecting all");
      this.room.disconnect();
    }
  }
}
