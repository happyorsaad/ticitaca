"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = exports.Player = exports.PieceType = exports.MessageCodes = exports.GamePlayState = void 0;
const schema_1 = require("@colyseus/schema");
var GamePlayState;
(function (GamePlayState) {
    GamePlayState[GamePlayState["RUNNING"] = 0] = "RUNNING";
    GamePlayState[GamePlayState["WAITING"] = 1] = "WAITING";
    GamePlayState[GamePlayState["PLAYER_DISCONNECTED"] = 2] = "PLAYER_DISCONNECTED";
    GamePlayState[GamePlayState["ROUND_OVER"] = 3] = "ROUND_OVER";
    GamePlayState[GamePlayState["GAME_OVER"] = 4] = "GAME_OVER";
})(GamePlayState || (exports.GamePlayState = GamePlayState = {}));
var MessageCodes;
(function (MessageCodes) {
    MessageCodes[MessageCodes["PLAY_TURN"] = 0] = "PLAY_TURN";
})(MessageCodes || (exports.MessageCodes = MessageCodes = {}));
var PieceType;
(function (PieceType) {
    PieceType[PieceType["SMALL_0"] = 0] = "SMALL_0";
    PieceType[PieceType["LARGE_0"] = 1] = "LARGE_0";
    PieceType[PieceType["SMALL_1"] = 2] = "SMALL_1";
    PieceType[PieceType["LARGE_1"] = 3] = "LARGE_1";
    PieceType[PieceType["NO_PIECE"] = 4] = "NO_PIECE";
})(PieceType || (exports.PieceType = PieceType = {}));
class Player extends schema_1.Schema {
    constructor(id, name, idx) {
        super();
        this.id = "";
        this.name = "";
        this.idx = 0;
        this.numWins = 0;
        this.numOfSmallPieces = 8;
        this.numOfLargePieces = 8;
        this.isOwner = false;
        this.id = id;
        this.name = name || id;
        this.idx = idx;
        this.isConnected = true;
        this.hasLeft = false;
    }
}
exports.Player = Player;
__decorate([
    (0, schema_1.type)("string")
], Player.prototype, "id", void 0);
__decorate([
    (0, schema_1.type)("string")
], Player.prototype, "name", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Player.prototype, "idx", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Player.prototype, "isConnected", void 0);
__decorate([
    (0, schema_1.type)("boolean")
], Player.prototype, "hasLeft", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Player.prototype, "numWins", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Player.prototype, "numOfSmallPieces", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], Player.prototype, "numOfLargePieces", void 0);
class GameState extends schema_1.Schema {
    constructor() {
        super();
        this.currentTurn = 0;
        this.players = new schema_1.MapSchema();
        this.board = new schema_1.ArraySchema();
        this.playState = GamePlayState.RUNNING;
        this.BOARD_SIZE = 6;
        this.indexToSessinId = {};
        this.resetBoard();
    }
    resetBoard() {
        this.board = new schema_1.ArraySchema();
        for (var row = 0; row < this.BOARD_SIZE; row++) {
            for (var col = 0; col < this.BOARD_SIZE; col++) {
                this.board.push(PieceType.NO_PIECE);
            }
        }
    }
}
exports.GameState = GameState;
__decorate([
    (0, schema_1.type)("int8")
], GameState.prototype, "currentTurn", void 0);
__decorate([
    (0, schema_1.type)({ map: Player })
], GameState.prototype, "players", void 0);
__decorate([
    (0, schema_1.type)(["uint8"])
], GameState.prototype, "board", void 0);
__decorate([
    (0, schema_1.type)("uint8")
], GameState.prototype, "playState", void 0);
//# sourceMappingURL=GameState.js.map