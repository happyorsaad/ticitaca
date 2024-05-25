extends Control

@onready var game_board = $VB/Board
@onready var game_status = $VB/GameStatus

const PIECE = preload("res://scenes/piece/piece.tscn")
const SLOT = preload("res://scenes/slot/board_slot.tscn")

const WINNER_MSG = "Woohoo !!\nYou Won The Last Round\nCongratulations"
const LOSER_MSG = "Aww\nYou Lost The Last Round\nLet's Win The Next One"

# Schema Constants
const Schema = preload("res://network/game_schema.gd")
const GamePlayState = Schema.GamePlayState
const PieceType = Schema.PieceType
const BOARD_SIZE = Schema.BOARD_SIZE

func on_state_update(new_state: Schema.GameState, is_polled):
	update_board_pieces(new_state)
	update_game_status(new_state)

func update_game_status(state):
	var my_id  = Client.get_client_id()
	var my_idx = state.players.at(my_id).idx
	
	var msg = ""
	if state.lastRoundWinner == my_idx:
		msg = WINNER_MSG
	else:
		msg = LOSER_MSG

	game_status.text = msg
	
func update_board_pieces(state):
	var board: Array = state.board.to_object()
	
	if game_board.get_child_count() == 0:
		for index in board.size():
			var slot = SLOT.instantiate()
			slot.slot_idx = index
			game_board.add_child(slot)

	for node: Slot in game_board.get_children():
		node.reset_slot()

	for index in board.size():
		var slot: Slot = game_board.get_children()[index]
		slot.slot_idx = index
		var piece_type = board[index]
		if piece_type != PieceType.NO_PIECE:
			slot.add_child(new_piece(piece_type, false))

func new_piece(type, can_be_dragged = true) -> Piece:
	var piece = PIECE.instantiate()
	piece.piece_type = type
	piece.can_be_dragged = can_be_dragged
	return piece
