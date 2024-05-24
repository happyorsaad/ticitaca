extends Control

@onready var state_screen = $StateScreen

# Screens
const player_disconnected = preload("res://scenes/player_disconnected/player_disconnected.tscn")
const connection_lost = preload("res://scenes/connection_lost/connection_lost.tscn")

## Game Screens
const game_running = preload("res://scenes/game/game_running/game_running.tscn")
const round_over = preload("res://scenes/game/round_over/round_over.tscn")

# Schema
const Schema = preload("res://network/game_schema.gd")
const GamePlayState = Schema.GamePlayState

var state : Schema.GameState
var prev_state: Schema.GameState

const GAME_SCREENS = {
	GamePlayState.RUNNING : game_running,
	GamePlayState.ROUND_OVER : round_over
}

func _ready():
	SignalManager.on_message_received.connect(_on_message_received)
	SignalManager.on_game_state_change.connect(_on_state_changed)
	SignalManager.on_connection_dropped.connect(_on_connection_lost)
	
func _on_connection_lost():
	SignalManager.change_screen_to.emit(connection_lost)

func _on_state_changed(new_state):
	if not new_state:
		return
	handle_new_state(new_state, false)
	
func _on_message_received(type, message):
	var current_scene = get_current_screen()
	if current_scene and current_scene.has_method("on_message_received"):
		current_scene.on_message_received(type, message)
		
func _on_refresh_state_timeout():
	print("_on_refresh_state_timeout")
	var new_state = Client.get_room_state()
	print("new_state", new_state)
	print("prev_state", self.prev_state)
	if not new_state:
		return
	handle_new_state(new_state, true)
	
func handle_new_state(new_state: Schema.GameState, is_polled):
	if not prev_state:
		change_game_screen_to(
			GAME_SCREENS[new_state.playState]
		)
	
	if prev_state and prev_state.playState != new_state.playState:
		change_game_screen_to(
			GAME_SCREENS[new_state.playState]
		)
	
	print("UPDATING STATE")
	
	var current_screen = get_current_screen()
	if current_screen:
		current_screen.on_state_update(self.prev_state, new_state, is_polled)
	
	self.prev_state = new_state
	
func update_is_connected(state):
	if has_only_one_player(state) or other_player_has_disconnected(state):
		SignalManager.change_screen_to.emit(player_disconnected)
	
func has_only_one_player(state):
	if not state.players:
		false
	
	if state.playState == GamePlayState.WAITING:
		return false
		
	if state.players.size() == 1:
		return true

func other_player_has_disconnected(state):
	if not state.players:
		return false
	
	for key in state.players:
		print(key)
	
	return false
	
func get_current_screen():
	print("state_screen.get_child_count()", state_screen.get_child_count())
	if state_screen.get_child_count() > 0:
		return state_screen.get_children()[0]
	return null
	
func change_game_screen_to(screen): 
	for prev in state_screen.get_children():
		prev.queue_free()
	var curr = screen.instantiate()
	print("change_game_screen_to", curr)
	state_screen.add_child(curr)
