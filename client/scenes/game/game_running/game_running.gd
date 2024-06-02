extends Control

@onready var game_board = $Layout/Board
@onready var opponent_details = $OpponentDetails/details
@onready var player_details = $PlayerDetails/details

@onready var opponents_pieces = $Layout/OpponentsPieces
@onready var player_pieces = $Layout/PlayerPieces
@onready var place_sound = $place_sound

const BOOP_TIME = 0.5

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

const ROW_MATCH_DIRECTIONS = [
	{ "row": -1, "col": 0, "row_2": 1, "col_2": 0 },
	{ "row": 0, "col": -1, "row_2": 0, "col_2": 1 },
	{ "row": -1, "col": -1, "row_2": 1, "col_2": 1 },
	{ "row": 1, "col": -1, "row_2": -1, "col_2": 1 },	
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

func get_neighbours(idx):
	var neighbours = []
	var row = idx / BOARD_SIZE
	var col = idx % BOARD_SIZE
	for index in MOVE_DIRECTIONS.size():
		var row_adj = row + MOVE_DIRECTIONS[index]["row"]
		var col_adj = col + MOVE_DIRECTIONS[index]["col"]
		if is_in_bounds(row_adj, col_adj):
			neighbours.push_back(row_adj * BOARD_SIZE + col_adj)
	return neighbours

func player_type_for_piece(type):
	match type:
		PieceType.SMALL_0:
			return 0
		PieceType.LARGE_0:
			return 0
		PieceType.SMALL_1:
			return 1
		PieceType.LARGE_1:
			return 1
			
func highlight_consecutive_slots():
	var slots_to_blink: Array = []
	var tween = get_tree().create_tween().set_loops(4)
	tween.set_parallel(true)
	for idx in game_board.get_child_count():
		var row = idx / BOARD_SIZE
		var col = idx % BOARD_SIZE
		
		var piece_center: Piece = game_board.get_children()[idx].get_child_piece()
		if not piece_center:
			continue
			
		for move_idx in ROW_MATCH_DIRECTIONS.size():
			var row_adj = row + ROW_MATCH_DIRECTIONS[move_idx]["row"]
			var col_adj = col + ROW_MATCH_DIRECTIONS[move_idx]["col"]
			var row_2_adj = row + ROW_MATCH_DIRECTIONS[move_idx]["row_2"]
			var col_2_adj = col + ROW_MATCH_DIRECTIONS[move_idx]["col_2"]
			
			if is_in_bounds(row_adj, col_adj) and is_in_bounds(row_2_adj, col_2_adj):
				var adj_location = row_adj * BOARD_SIZE + col_adj
				var adj_location_2 = row_2_adj * BOARD_SIZE + col_2_adj
				
				var piece: Piece = game_board.get_children()[adj_location].get_child_piece()
				var piece_2: Piece = game_board.get_children()[adj_location_2].get_child_piece()
			
				if piece and piece_2:
					print("types_of_adjacent", piece.piece_type, piece_2.piece_type)
					if player_type_for_piece(piece_center.piece_type) == player_type_for_piece(piece.piece_type) and player_type_for_piece(piece_center.piece_type) == player_type_for_piece(piece_2.piece_type):
						
						slots_to_blink.append(
							game_board.get_children()[adj_location]
						)
						
						slots_to_blink.append(
							game_board.get_children()[idx]	
						)
						
						slots_to_blink.append(
							game_board.get_children()[adj_location_2]
						)
				
	for idx in slots_to_blink.size():
		var slot = slots_to_blink[idx]
		tween.tween_property(slot, "modulate:a", 0.2, 0.2).set_trans(Tween.TRANS_SINE)
		tween.chain().tween_property(slot, "modulate:a", 1, 0.2).set_trans(Tween.TRANS_SINE)

func boop(idx, type, update_board = true):
	blink_neighbours(idx, type)
	
	var row = idx / BOARD_SIZE
	var col = idx % BOARD_SIZE

	var pieces_to_move: Array = []
	var pieces_to_move_outside_board: Array = []
	var pieces_to_bounce: Array = []
	
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
					
					var bounce_offset = Vector2(
						MOVE_DIRECTIONS[index]["boop_col"] * Slot.min_size * 0.1,
						MOVE_DIRECTIONS[index]["boop_row"] * Slot.min_size * 0.1
					)
					
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
							pieces_to_bounce.append(
								{
									"source" : source_slot,
									"target_pos": source_slot.global_position + bounce_offset
								}
							)
					else:
						var slot = game_board.get_children()[adj_location]
						var offset = Vector2(
							MOVE_DIRECTIONS[index]["boop_col"] * Slot.min_size / 2,
							MOVE_DIRECTIONS[index]["boop_row"] * Slot.min_size / 2
						)
						pieces_to_move_outside_board.append(
							{
								"source" : slot, 
								"target_pos" : slot.global_position + offset
							}
						)

	
	var tween = get_tree().create_tween().set_loops(1)
	tween.set_parallel()
	for move in pieces_to_move:
		var piece = move["source"].get_child_piece()
		var target_slot = move["target"]
		piece.emotion = Piece.EMOTION.SAD
		piece.queue_redraw()
		tween.tween_property(piece, "global_position", target_slot.global_position, BOOP_TIME)
	
	for move in pieces_to_bounce:
		var piece = move["source"].get_child_piece()
		piece.emotion = Piece.EMOTION.TOO_SMART
		piece.queue_redraw()
		tween.tween_property(piece, "global_position", move["target_pos"], 0.3).set_trans(Tween.TRANS_BOUNCE)
		tween.chain().tween_property(piece, "global_position", move["source"].global_position, 0.3).set_trans(Tween.TRANS_SPRING)
	
	for move in pieces_to_move_outside_board:
		var piece = move["source"].get_child_piece()
		var target_pos = move["target_pos"]
		piece.emotion = Piece.EMOTION.SAD
		piece.queue_redraw()
		tween.tween_property(piece, "global_position", target_pos, BOOP_TIME)
	
	await tween.finished
	
	for move in pieces_to_move_outside_board:
		var piece = move["source"].get_child_piece()
		if piece:
			piece.queue_free()
		
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
	
	highlight_consecutive_slots()

func blink_neighbours(idx, type):
	var color = Color.WHITE
	match type:
		PieceType.SMALL_0:
			color = Color.LIGHT_GREEN
		PieceType.LARGE_0:
			color = Color.LIGHT_GREEN
		PieceType.SMALL_1:
			color = Color.SKY_BLUE
		PieceType.LARGE_1:
			color = Color.SKY_BLUE
	
	var neighbours = get_neighbours(idx)
	neighbours.append(idx)
	for index in neighbours.size(): 
		var slot = game_board.get_children()[neighbours[index]]
		slot.self_modulate = color
		slot.self_modulate.a = 0.75
		slot.has_mouse = false
		slot.queue_redraw()
		
	await get_tree().create_timer(2).timeout
	
	for index in neighbours.size(): 
		var slot = game_board.get_children()[neighbours[index]]
		slot.self_modulate = Color.WHITE
		slot.self_modulate.a = 1
		slot.queue_redraw()
	
	
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
	
