extends Control

@onready var label = $VBoxContainer/Label
@onready var game_board = $VBoxContainer/Board

# Schema Constants
const Schema = preload("res://network/game_schema.gd")
const GamePlayState = Schema.GamePlayState
const PieceType = Schema.PieceType
const BOARD_SIZE = Schema.BOARD_SIZE

const PIECE = preload("res://scenes/piece/piece.tscn")
const SLOT = preload("res://scenes/slot/board_slot.tscn")

func on_state_update(new_state: Schema.GameState, is_polled):
	SignalManager.on_slot_doubleclicked.connect(_on_slot_clicked)
	update_board_pieces(new_state)
	
func _on_slot_clicked(idx):
	Client.send_message("short_piece_selected", {
		"location" : idx
	})
	
func on_message_received(type, message):
	pass
	
func update_board_pieces(state):
	var my_id = Client.get_client_id()
	var my_idx = state.players.at(my_id).idx
	
	if my_idx != state.currentTurn:
		label.text = "Other Player Choosing Piece To Upgrade\n\n\n"
		
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
			var piece = new_piece(piece_type, false)
			piece.modulate.a = 0.2
			piece.mouse_filter = Control.MOUSE_FILTER_PASS
			if my_idx == state.currentTurn:
				if my_idx == 0:
					if piece_type == PieceType.SMALL_0:
						piece.modulate.a = 1
						slot.can_be_clicked = true
				else:
					if piece_type == PieceType.SMALL_1:
						piece.modulate.a = 1
						slot.can_be_clicked = true
			slot.add_child(piece)

func new_piece(type, can_be_dragged = true) -> Piece:
	var piece = PIECE.instantiate()
	piece.piece_type = type
	piece.can_be_dragged = can_be_dragged
	return piece
