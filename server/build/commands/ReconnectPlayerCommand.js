"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconnectPlayerCommand = void 0;
const command_1 = require("@colyseus/command");
class ReconnectPlayerCommand extends command_1.Command {
    execute({ sessionId } = this.payload) {
        let player = this.state.players.get(sessionId);
        player.isConnected = true;
    }
}
exports.ReconnectPlayerCommand = ReconnectPlayerCommand;
//# sourceMappingURL=ReconnectPlayerCommand.js.map