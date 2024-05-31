extends Control

@onready var state_screen = $StateScreen
@onready var chat_window = $MarginContainer/ChatWindow

# Screens
const player_disconnected = preload("res://scenes/player_disconnected/player_disconnected.tscn")
const connection_lost = preload("res://scenes/connection_lost/connection_lost.tscn")

## Game Screens
const game_running = preload("res://scenes/game/game_running/game_running.tscn")
const round_over = preload("res://scenes/game/round_over/round_over.tscn")
const round_over_screen = preload("res://scenes/game/waiting/game_waiting.tscn")
const player_choosing_small_piece_to_upgrade = preload("res://scenes/game/choose_piece_to_upgrade/choose_piece_to_upgrade.tscn")
# Schema
const Schema = preload("res://network/game_schema.gd")
const GamePlayState = Schema.GamePlayState

var state : Schema.GameState
var prev_state_obj

var show_chat_window = false

const GAME_SCREENS = {
	GamePlayState.RUNNING : game_running,
	GamePlayState.ROUND_OVER : round_over,
	GamePlayState.WAITING: round_over_screen,
	GamePlayState.PLAYER_CHOOSING_SMALL_PIECE_TO_UPGRADE: player_choosing_small_piece_to_upgrade,
	GamePlayState.PLAYER_DISCONNECTED: player_disconnected
}

func _ready():
	SignalManager.on_message_received.connect(_on_message_received)
	SignalManager.on_game_state_change.connect(_on_state_changed)
	SignalManager.on_connection_dropped.connect(_on_connection_lost)
	SignalManager.on_reconnection.connect(_on_state_changed)
	
	ReconnectionInfo.saveToken(Client.room.reconnection_token)
	
func _on_connection_lost():
	change_game_screen_to(
		connection_lost	
	)

func _on_state_changed(new_state):
	if not new_state:
		return
	var new_state_obj = new_state.to_object()
	handle_new_state(new_state, new_state_obj, false)
	
func _on_message_received(type, message):
	var current_scene = get_current_screen()
	if current_scene and current_scene.has_method("on_message_received"):
		current_scene.on_message_received(type, message)
		
func _on_refresh_state_timeout():
	var new_state = Client.get_room_state()
	var new_state_obj = new_state.to_object()
	if not new_state:
		return
	handle_new_state(new_state, new_state_obj, true)
	
func handle_new_state(new_state, new_state_obj, is_polled):
	if not check_is_connected(new_state):
		new_state.playState = GamePlayState.PLAYER_DISCONNECTED
	
	if not Utils.is_equal_dict(prev_state_obj, new_state_obj):
		var current_scene = get_current_screen()		
		if not prev_state_obj or (prev_state_obj["playState"] != new_state_obj["playState"]):
			print("new_state", new_state)
			print("new_state_obj", new_state_obj)
			current_scene = change_game_screen_to(
				GAME_SCREENS[new_state.playState]
			)
		if current_scene and current_scene.has_method("on_state_update"):
			current_scene.on_state_update(new_state, is_polled)
		prev_state_obj = new_state_obj
		
func check_is_connected(state):
	if has_only_one_player(state) or other_player_has_disconnected(state):
		return false
	return true
	
func has_only_one_player(state):
	if not state.players:
		false
	
	if state.playState == GamePlayState.WAITING:
		return false
		
	if state.players.keys().size() == 1:
		return true

func other_player_has_disconnected(state):
	if not state.players:
		return false
	
	for key in state.players.keys():
		if key != Client.get_client_id() and not state.players.at(key).isConnected:
			return true
			
	return false
	
func get_current_screen():
	if state_screen.get_child_count() > 0:
		return state_screen.get_children()[0]
	return null
	
func change_game_screen_to(screen): 
	for prev in state_screen.get_children():
		prev.queue_free()
	var curr = screen.instantiate()
	state_screen.add_child(curr)
	return curr
	
func _on_chat_icon_pressed():
	show_chat_window = not show_chat_window
	chat_window.visible = show_chat_window
