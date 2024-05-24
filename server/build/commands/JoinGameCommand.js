"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinGameCommand = void 0;
const command_1 = require("@colyseus/command");
const GameState_1 = require("../rooms/schema/GameState");
class JoinGameCommand extends command_1.Command {
    validate({ sessionId } = this.payload) {
        return (this.state.players.size < this.room.maxClients &&
            !this.state.players.has(sessionId));
    }
    execute({ sessionId, name } = this.payload) {
        const playerIdx = this.state.players.size;
        this.state.indexToSessinId[playerIdx] = sessionId;
        this.state.players.set(sessionId, new GameState_1.Player(sessionId, name, playerIdx));
    }
}
exports.JoinGameCommand = JoinGameCommand;
//# sourceMappingURL=JoinGameCommand.js.map