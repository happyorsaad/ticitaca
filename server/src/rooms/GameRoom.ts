import { Room, Client } from "@colyseus/core";
import { GameState, MessageCodes, PieceType } from "./schema/GameState";
import { Dispatcher } from "@colyseus/command";
import { JoinGameCommand } from "../commands/JoinGameCommand";
import { OnConsentedLeaveCommand } from "../commands/OnConsentedLeaveCommand";
import { ReconnectPlayerCommand } from "../commands/ReconnectPlayerCommand";
import { NewOwnerCommand } from "../commands/NewOwnerCommand";
import { PlayMoveCommand } from "../commands/PlayMoveCommand";

export class GameRoom extends Room<GameState> {
  private MAX_PLAYERS: number = 2;
  
  dispatcher: Dispatcher<GameRoom>;
  
  onCreate (options: any) {
    this.maxClients = this.MAX_PLAYERS;
    this.dispatcher = new Dispatcher(this);
    
    this.setState(new GameState());

    this.onMessage("play_move", (client, message) => {
      console.log("PLAY_TURN", message);
      this.dispatcher.dispatch(new PlayMoveCommand(), {
        sessionId: client.sessionId,
        pieceType: message.pieceType,
        location: message.location,
      });
    }
    );
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    console.log("options", options);
    this.dispatcher.dispatch(new JoinGameCommand(), {
      sessionId: client.sessionId,
      name: options.name,
    });
  }

  async onLeave(client: Client, consented: boolean) {
    let player = this.state.players.get(client.sessionId);
    player.isConnected = false;

    if (consented) {
      this.dispatcher.dispatch(new OnConsentedLeaveCommand(), {
        sessionId: client.sessionId,
      });
      return;
    }

    // let replaceOwnerTimeout;
    // if (player.isOwner) {
    //   console.log(client.sessionId + " was owner");
    //   replaceOwnerTimeout = this.clock.setTimeout(
    //     () =>
    //       this.dispatcher.dispatch(new NewOwnerCommand(), {
    //         lastOwnerId: client.sessionId,
    //       }),
    //     15_000
    //   );
    // }

    // console.log("on Leave");

    // try {
    //   console.log("waiting for reconnection from :", client.sessionId);
    //   await this.allowReconnection(client, 60);
    //   console.log("reconnected");

    //   if (replaceOwnerTimeout) replaceOwnerTimeout.clear();
    //   this.dispatcher.dispatch(new ReconnectPlayerCommand(), {
    //     sessionId: client.sessionId,
    //   });
    // } catch {
    //   player.hasLeft = true;
    // }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
