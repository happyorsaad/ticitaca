"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnConsentedLeaveCommand = void 0;
const command_1 = require("@colyseus/command");
const GameState_1 = require("../rooms/schema/GameState");
class OnConsentedLeaveCommand extends command_1.Command {
    execute({ sessionId } = this.payload) {
        if (this.state.playState == GameState_1.GamePlayState.WAITING) {
            this.state.players.delete(sessionId);
        }
        this.room.unlock();
        this.state.players.get(sessionId).hasLeft = true;
    }
}
exports.OnConsentedLeaveCommand = OnConsentedLeaveCommand;
//# sourceMappingURL=OnConsentedLeaveCommand.js.map