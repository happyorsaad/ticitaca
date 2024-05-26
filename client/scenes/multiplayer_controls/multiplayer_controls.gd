extends CanvasLayer

const Schema = preload("res://network/game_schema.gd")
const GamePlayState = Schema.GamePlayState


var game_screen = preload("res://scenes/game/game.tscn")
@onready var server_ip = $"Start/ServerIP/ServerIP"

# Start Menu
@onready var start = $Start
@onready var player_name = $Start/PlayerNameContainer/PlayerName
@onready var host_game_btn = $Start/HostGame
@onready var join_game_btn = $Start/JoinGame

# Host Menu
@onready var host = $Host
@onready var room_name = $Host/RoomName

# Join Menu
@onready var join = $Join
@onready var room_id_input = $Join/RoomIdContainer/RoomId
@onready var join_room_btn = $Join/JoinContainer/Join

# Info Controls
@onready var progress_spinner = $MessageContainer/ProgressSpinner
@onready var message: Label = $MessageContainer/Message

const HOST_ERROR_MESSAGE = "Failed To Host The Game\nMaybe The Server Is Down\nPlease Retry"
const JOIN_ERROR_MESSAGE = "Failed To Join The Game\nMaybe The Server Is Down Or\nThe Room ID is incorrect\nPlease Retry"

const WAITING_MESSAGE = "Created Room\nPlease share the Room Id With The Other Player\nWaiting For Other Player To Join"
const CONNECTED_TO_ROOM_MESSAGE = "Connected To Room\nWaiting For The Game To Start"
const EMPTY_MESSAGE = ""

var RandomNames = NameGenerator.new()

func _ready():
	SignalManager.on_game_state_change.connect(_game_state_change)
	show_start_game_view()
	
func _game_state_change(state):
	if state.playState == GamePlayState.RUNNING:
		SignalManager.change_screen_to.emit(game_screen)
	
func _on_host_game_pressed():
	toggle_button(host_game_btn, true)
	toggle_button(join_game_btn, true)
	
	var name = _get_player_name()
	var ip = server_ip.text.strip_edges()
	show_spinner()
	var result = await Client.join_or_create({"name": name}, ip)
	
	toggle_button(host_game_btn, false)
	toggle_button(join_game_btn, false)
	
	if not result:
		show_message(HOST_ERROR_MESSAGE)
	else:
		hide_spinner()
		show_host_game_view()

func _on_join_game_pressed():
	hide_all()
	
	join.visible = true
	message.text = EMPTY_MESSAGE


func show_host_game_view():
	hide_all()
	
	host.visible = true
	room_name.text = "[center]%s[/center]" % Client.get_room_id()
	show_message(WAITING_MESSAGE)
	
	
func show_start_game_view():
	hide_all()
	
	start.visible = true
	message.text = EMPTY_MESSAGE

func show_join_game_view():
	hide_all()
	
	join.visible = true
	message.text = EMPTY_MESSAGE

func _get_player_name():
	var name = player_name.text.strip_edges()
	if name and !name.is_empty():
		return name
	else:
		return RandomNames.new_name()[2]

func hide_all():
	start.visible = false
	host.visible = false
	join.visible = false

func _on_leave_pressed():
	Client.leave_room()
	show_start_game_view()

func _on_join_room_pressed():
	show_spinner()
	
	toggle_button(join_room_btn, true)
	
	var name = _get_player_name()
	var room_id = room_id_input.text.strip_edges()
	var ip = server_ip.text.strip_edges()
	var result = await Client.join_room(room_id, {
		"name": name
	},ip)
	
	toggle_button(join_room_btn, false)
	
	if not result:
		show_message(JOIN_ERROR_MESSAGE)
	else:
		show_message(CONNECTED_TO_ROOM_MESSAGE)

func toggle_button(button, to_disable: bool):
	if to_disable:
		button.disabled = true
		button.modulate.a = 0.7
	else:
		button.disabled = false
		button.modulate.a = 1

func _on_back_pressed():
	show_start_game_view()

func show_spinner():
	progress_spinner.visible = true
	message.visible = false
	
func hide_spinner():
	progress_spinner.visible = false
	
func show_message(msg):
	hide_spinner()
	
	message.visible = true
	message.text = msg
