"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoom = void 0;
const core_1 = require("@colyseus/core");
const GameState_1 = require("./schema/GameState");
const command_1 = require("@colyseus/command");
const JoinGameCommand_1 = require("../commands/JoinGameCommand");
const PlayMoveCommand_1 = require("../commands/PlayMoveCommand");
class GameRoom extends core_1.Room {
    constructor() {
        super(...arguments);
        this.MAX_PLAYERS = 2;
    }
    onCreate(options) {
        this.maxClients = this.MAX_PLAYERS;
        this.dispatcher = new command_1.Dispatcher(this);
        this.setState(new GameState_1.GameState());
        this.onMessage("play_move", (client, message) => {
            console.log("PLAY_TURN", message);
            this.dispatcher.dispatch(new PlayMoveCommand_1.PlayMoveCommand(), {
                sessionId: client.sessionId,
                pieceType: message.pieceType,
                location: message.location,
            });
        });
    }
    onJoin(client, options) {
        console.log(client.sessionId, "joined!");
        console.log("options", options);
        this.dispatcher.dispatch(new JoinGameCommand_1.JoinGameCommand(), {
            sessionId: client.sessionId,
            name: options.name,
        });
    }
    async onLeave(client, consented) {
        // let player = this.state.players.get(client.sessionId);
        // player.isConnected = false;
        // if (consented) {
        //   this.dispatcher.dispatch(new OnConsentedLeaveCommand(), {
        //     sessionId: client.sessionId,
        //   });
        //   return;
        // }
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
        console.log("on Leave");
        // try {
        //   console.log("waiting for reconnection from :", client.sessionId);
        //   await this.allowReconnection(client, 60 * 5);
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
exports.GameRoom = GameRoom;
//# sourceMappingURL=GameRoom.js.map