"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewOwnerCommand = void 0;
const command_1 = require("@colyseus/command");
class NewOwnerCommand extends command_1.Command {
    execute({ lastOwnerId } = this.payload) {
        if (this.state.players.get(lastOwnerId).isConnected)
            // owner returned
            return;
        let newOwner;
        this.state.players.forEach((player, id) => {
            if (player.isConnected)
                newOwner = id;
        });
        if (newOwner) {
            this.state.players.get(newOwner).isOwner = true;
            this.state.players.get(lastOwnerId).isOwner = false;
        }
        else {
            console.log("no new owner found, disconnecting all");
            this.room.disconnect();
        }
    }
}
exports.NewOwnerCommand = NewOwnerCommand;
//# sourceMappingURL=NewOwnerCommand.js.map