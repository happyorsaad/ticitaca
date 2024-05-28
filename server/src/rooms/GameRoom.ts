import { Room, Client } from "@colyseus/core";
import { GameState, MessageCodes, PieceType } from "./schema/GameState";
import { Dispatcher } from "@colyseus/command";
import { JoinGameCommand } from "../commands/JoinGameCommand";
import { OnConsentedLeaveCommand } from "../commands/OnConsentedLeaveCommand";
import { ReconnectPlayerCommand } from "../commands/ReconnectPlayerCommand";
import { NewOwnerCommand } from "../commands/NewOwnerCommand";
import { PlayMoveCommand } from "../commands/PlayMoveCommand";
import { ShortPieceSelectedCommand } from "../commands/ShortPieceSelectedCommand";
import { generate, count } from "random-words";

export class GameRoom extends Room<GameState> {
  private MAX_PLAYERS: number = 2;
  
  // The channel where we register the room IDs.
  // This can be anything you want, it doesn't have to be `$mylobby`.
  LOBBY_CHANNEL = "$mylobby"
  LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  dispatcher: Dispatcher<GameRoom>;
  
  // Generate a single 4 capital letter room ID.
  generateRoomIdSingle(): string {
    return generate({ maxLength: 4 , join: "-", exactly: 2 }).toUpperCase();
  }

  // 1. Get room IDs already registered with the Presence API.
  // 2. Generate room IDs until you generate one that is not already used.
  // 3. Register the new room ID with the Presence API.
  async generateRoomId(): Promise<string> {
    const currentIds = await this.presence.smembers(this.LOBBY_CHANNEL);
    let id;
    do {
        id = this.generateRoomIdSingle();
    } while (currentIds.includes(id));

    await this.presence.sadd(this.LOBBY_CHANNEL, id);
    return id;
  }


  async onCreate (options: any) {
    this.roomId = await this.generateRoomId();
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
    });

    this.onMessage("short_piece_selected", (client, message) => {
      console.log("SHORT_PIECE_SELECTED", message);
      this.dispatcher.dispatch(new ShortPieceSelectedCommand(), {
        sessionId: client.sessionId,
        idx: message.location,
      });
    });
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

    let replaceOwnerTimeout;
    if (player.isOwner) {
      console.log(client.sessionId + " was owner");
      replaceOwnerTimeout = this.clock.setTimeout(
        () =>
          this.dispatcher.dispatch(new NewOwnerCommand(), {
            lastOwnerId: client.sessionId,
          }),
        15_000
      );
    }

    console.log("on Leave");

    try {
      console.log("waiting for reconnection from :", client.sessionId);
      await this.allowReconnection(client, 60 * 5);
      console.log("reconnected");

      if (replaceOwnerTimeout) replaceOwnerTimeout.clear();
      this.dispatcher.dispatch(new ReconnectPlayerCommand(), {
        sessionId: client.sessionId,
      });
    } catch(e) {
      console.log("disconnected");
      player.hasLeft = true;
    }
  }

  async onDispose() {
    console.log("room", this.roomId, "disposing...");
    this.presence.srem(this.LOBBY_CHANNEL, this.roomId);
    console.log("room", this.roomId, "disposed!");
  }

}
