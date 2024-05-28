extends Control

@onready var game_board = $Layout/Board
@onready var opponent_details = $OpponentDetails/details
@onready var player_details = $PlayerDetails/details

@onready var opponents_pieces = $Layout/OpponentsPieces
@onready var player_pieces = $Layout/PlayerPieces
@onready var place_sound = $place_sound

const PIECE = preload("res://scenes/piece/piece.tscn")
const SLOT = preload("res://scenes/slot/board_slot.tscn")

# Schema Constants
const Schema = preload("res://network/game_schema.gd")
const GamePlayState = Schema.GamePlayState
const PieceType = Schema.PieceType
const BOARD_SIZE = Schema.BOARD_SIZE

const MOVE_DIRECTIONS = [
	{ "row": -1, "col": 0, "boop_row": -2, "boop_col": 0 },
	{ "row": 1, "col": 0, "boop_row": 2, "boop_col": 0 },
	{ "row": 0, "col": -1, "boop_row": 0, "boop_col": -2 },
	{ "row": 0, "col": 1, "boop_row": 0, "boop_col": 2 },
	{ "row": -1, "col": -1, "boop_row": -2, "boop_col": -2 },
	{ "row": -1, "col": 1, "boop_row": -2, "boop_col": 2 },
	{ "row": 1, "col": -1, "boop_row": 2, "boop_col": -2 },
	{ "row": 1, "col": 1, "boop_row": 2, "boop_col": 2 },
];

const PIECE_TYPES_FOR_IDX = {
	0 : {
		"small" : PieceType.SMALL_0,
		"large" : PieceType.LARGE_0,
	},
	1 : {
		"small" : PieceType.SMALL_1,
		"large" : PieceType.LARGE_1,
	}
}

var my_id
var other_id
var current_state

func _ready():
	SignalManager.on_piece_dropped.connect(_on_piece_dropped_in_slot)

func on_state_update(new_state: Schema.GameState, is_polled):
	update_ids(new_state.players)
	update_opponent_pieces(new_state)
	update_player_pieces(new_state)
	update_player_details(new_state.players)
	update_board_pieces(new_state)
	self.current_state = new_state
	
func on_message_received(type, message):
	if type == "player_move":
		var idx = message["playerIdx"]	
		var piece_type = message["pieceType"]
		var location = message["location"]
		if self.current_state and idx != current_state.players.at(my_id).idx:
			add_piece_to_slot(location, piece_type)
			boop(location, piece_type, false)
		
func add_piece_to_slot(idx, type):
	var piece = new_piece(type, false)
	var slot = game_board.get_children()[idx]
	slot.add_child(piece)

func _on_piece_dropped_in_slot(idx, type):
	place_sound.stop()
	place_sound.play()
	
	add_piece_to_slot(idx, type)
	boop(idx, type)
	disable_player_pieces()
	
	Client.send_message("play_move", {
		"pieceType" : type,
		"location": idx
	})

func disable_player_pieces():
	for piece: Piece in player_pieces.get_children():
		if piece:
			piece.can_be_dragged = false
		
func update_ids(players):
	self.my_id = Client.get_client_id()
	self.other_id = get_other_player_id(players, self.my_id)

func get_other_player_id(players, my_id):
	var other_ids = players.keys().filter(
						func(id): return id != my_id
					)
	
	if other_ids.is_empty():
		return null
	return other_ids[0]
	
func update_player_details(players):
	var template = "%s\nWins : %d"
	
	var opp = players.at(self.other_id)
	opponent_details.text = template % [
		opp.name, opp.numWins
	]
	
	var my = players.at(self.my_id)
	player_details.text = template % [
		my.name, my.numWins
	]

func update_opponent_pieces(state):
	if not self.other_id:
		pass
	var other_player = state.players.at(other_id)
	update_pieces(opponents_pieces, other_player, false)
	if not other_player.idx == state.currentTurn:
		opponents_pieces.modulate.a = 0.3
	else:
		opponents_pieces.modulate.a = 1
		
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

func update_player_pieces(state):
	if not state.players.keys().has(self.my_id):
		return
	var my_player = state.players.at(self.my_id)
	update_pieces(player_pieces, my_player, true)
	disable_if_not_my_turn(my_player, state.currentTurn)

func disable_if_not_my_turn(my_player, currentTurn):
	var mouse_filter_value = Control.MOUSE_FILTER_STOP
	if not my_player.idx == currentTurn:
		mouse_filter_value = Control.MOUSE_FILTER_IGNORE
		player_pieces.modulate.a = 0.7
	else:
		player_pieces.modulate.a = 1
	
	for node in player_pieces.get_children():
		node.mouse_filter = mouse_filter_value
		for child in node.get_children():
			if child.is_class("Control"):
				child.mouse_filter = mouse_filter_value
			
func update_pieces(pieces_ui, player, can_be_dragged):
	var player_idx = player.idx
	var small_piece = PIECE_TYPES_FOR_IDX[player_idx]["small"]
	var large_piece = PIECE_TYPES_FOR_IDX[player_idx]["large"]
	
	for node in pieces_ui.get_children():
		node.queue_free()
	
	for i in range(player.numOfSmallPieces):
		pieces_ui.add_child(new_piece(small_piece, can_be_dragged, 100))
	
	for i in range(player.numOfLargePieces):
		pieces_ui.add_child(new_piece(large_piece, can_be_dragged, 100))
	
	for i in range(8 - player.numOfLargePieces - player.numOfSmallPieces):
		pieces_ui.add_child(new_piece(PieceType.NO_PIECE, can_be_dragged, 100))

func new_piece(type, can_be_dragged = true, piece_size = null) -> Piece:
	var piece = PIECE.instantiate()
	piece.piece_type = type
	piece.can_be_dragged = can_be_dragged
	if piece_size:
		piece.min_size = piece_size
	return piece

func is_my_turn(player, currentTurn):
	return player.idx == currentTurn

func is_in_bounds(row, col):
	return row >= 0 && row <= 5 && col >= 0 && col <= 5

func boop(idx, type, update_board = true):
	var row = idx / BOARD_SIZE
	var col = idx % BOARD_SIZE

	var pieces_to_move: Array = []
	
	for index in MOVE_DIRECTIONS.size():
		var row_adj = row + MOVE_DIRECTIONS[index]["row"]
		var col_adj = col + MOVE_DIRECTIONS[index]["col"]
		
		if is_in_bounds(row_adj, col_adj):
			
			var adj_location = row_adj * BOARD_SIZE + col_adj
			var piece: Piece = game_board.get_children()[adj_location].get_child_piece()
			
			if piece != null:
				if can_move(type, piece.piece_type):
					var source_slot = game_board.get_children()[adj_location]
					var boop_row = row + MOVE_DIRECTIONS[index]["boop_row"]
					var boop_col = col + MOVE_DIRECTIONS[index]["boop_col"]
					var boop_to_idx = boop_row * BOARD_SIZE + boop_col
					
					if is_in_bounds(boop_row, boop_col):
						if game_board.get_children()[boop_to_idx].get_child_count() == 0:
							var target_slot = game_board.get_children()[boop_to_idx]
							pieces_to_move.append(
								{
									"source" : source_slot,
									"target" : target_slot
								}
							)
					else:
						var slot = game_board.get_children()[adj_location]
						for child in slot.get_children():
							child.queue_free()
	
	var tween = get_tree().create_tween().set_loops(1)
	tween.set_parallel()
	for move in pieces_to_move:
		var piece = move["source"].get_child_piece()
		var target_slot = move["target"]
		piece.emotion = Piece.EMOTION.SAD
		piece.queue_redraw()
		tween.tween_property(piece, "global_position", target_slot.global_position, 0.5)
	
	await tween.finished
	
	for move in pieces_to_move:
		var piece = move["source"].get_child_piece()
		if piece:
			var target_slot = move["target"]
			var source_slot = move["source"]
			move_piece_to_slot.bind(
				source_slot, 
				target_slot, 
				piece.piece_type
			)
	
func move_piece_to_slot(source_slot, target_slot, type):
	if not source_slot:
		return
	
	if not target_slot:
		return
		
	for node in source_slot.get_children():
		node.queue_free()
	
	var piece = PIECE.instantiate()
	piece.piece_type = type
	piece.can_be_dragged = false
	target_slot.add_child(piece)
	
	
func can_move(placed_type, neighbour_type):
	if placed_type == PieceType.LARGE_0 || placed_type == PieceType.LARGE_1:
		return true
	return neighbour_type == PieceType.SMALL_0 || neighbour_type == PieceType.SMALL_1

#func _on_change_emotion_timeout():
	#if piece_type == PieceType.NO_PIECE:
		#return
	#
	#if piece_type == PieceType.LARGE_0:
		#return
	#
	#if piece_type == PieceType.LARGE_1:
		#return
		#
	#var rng = RandomNumberGenerator.new()
	#
	#var default_emotion = get_default_emotion()
	#var new_emotion = [EMOTION.CUTE, EMOTION.TOO_SMART].pick_random()
#
	#await get_tree().create_timer(rng.randf_range(1, 3)).timeout
	#
	#self.emotion = new_emotion
	#self.queue_redraw()
	#
	#await get_tree().create_timer(rng.randf_range(3, 5)).timeout
	#
	#self.emotion = default_emotion
	#self.queue_redraw()
	

func __mock():
	self.other_id = "y-KLOZaVI"
	self.my_id = "-9TmBb6iB"
	
	self.state = { 
		"currentTurn": 0, 
		"players": 
			{ "y-KLOZaVI": 
				{
					"hasLeft":false,
					"id":"y-KLOZaVI",
					"idx":0,
					"isConnected":true,
					"name":"P",
					"numOfLargePieces":4,
					"numOfSmallPieces":4,
					"numWins":0
				},
			 "-9TmBb6iB": 
				{
					"hasLeft":false,
					"id":"-9TmBb6iB",
					"idx":1,
					"isConnected":true,
					"name":"P",
					"numOfLargePieces":4,
					"numOfSmallPieces":4,
					"numWins":0} 
				}, 
			"board": 
				[4, 4, 0, 4, 4, 4,
				 4, 4, 4, 4, 4, 4,
				 4, 4, 4, 1, 4, 4,
				 4, 2, 4, 4, 4, 4,
				 4, 4, 4, 4, 4, 4,
				 4, 4, 4, 4, 4, 4], 
			"playState": 0 
	}
	
