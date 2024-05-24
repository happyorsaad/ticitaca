extends Node

const colyseus = preload("res://addons/godot_colyseus/lib/colyseus.gd")

enum PieceType {
	SMALL_0,
	LARGE_0,
	SMALL_1,
	LARGE_1,
	NO_PIECE
}

enum GamePlayState {
	RUNNING = 0,
	WAITING,
	PLAYER_DISCONNECTED,
	ROUND_OVER,
	GAME_OVER,
}

const BOARD_SIZE = 6

class PlayerState extends colyseus.Schema:
	static func define_fields():
		return [
			colyseus.Field.new("id", colyseus.STRING),
			colyseus.Field.new("name", colyseus.STRING),
			colyseus.Field.new("idx", colyseus.UINT8),
			colyseus.Field.new("isConnected", colyseus.BOOLEAN),
			colyseus.Field.new("hasLeft", colyseus.BOOLEAN),
			colyseus.Field.new("numWins", colyseus.UINT8),
			colyseus.Field.new("numOfSmallPieces", colyseus.UINT8),
			colyseus.Field.new("numOfLargePieces", colyseus.UINT8),	
		]
	
	var node
	
class GameState extends colyseus.Schema:
	static func define_fields():
		return [
			colyseus.Field.new("currentTurn", colyseus.INT8),
			colyseus.Field.new("players", colyseus.MAP, PlayerState),
			colyseus.Field.new("board", colyseus.ARRAY, colyseus.UINT8),
			colyseus.Field.new("playState", colyseus.UINT8),
		]
		


