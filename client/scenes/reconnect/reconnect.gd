extends Control

@onready var progress_spinner = $MessageContainer/ProgressSpinner
@onready var message = $MessageContainer/Message
@onready var sure = $VBoxContainer/Sure
@onready var no_thanks = $VBoxContainer/NoThanks
@onready var no_thanks_msg = $VBoxContainer/NoThanks/NoThanks

const start_screen = preload("res://scenes/start/start.tscn")

const JOIN_ERROR_MESSAGE = "Could Not Reconnect To Room"
const RECONNECTED_TO_ROOM_MESSAGE = "Reconnected To Room\nWaiting For the Game To Load"

const MESSAGE_TIME = 5

var token: ReconnectionToken

func _ready():
	token = ReconnectionInfo.loadToken()

func _on_sure_pressed():
	if not token.reconnection_token:
		return
	
	show_spinner()
	
	toggle_button(sure, true)
	
	no_thanks_msg.text = "Quit Trying"
	
	var result = await Client.reconnect_to_room(token.reconnection_token)
	
	toggle_button(sure, false)
	
	if not result:
		show_message(JOIN_ERROR_MESSAGE)
		ReconnectionInfo.saveToken(null)
		SignalManager.change_screen_to.emit(start_screen)
	else:
		show_message(RECONNECTED_TO_ROOM_MESSAGE)
	
	no_thanks_msg.text = "No Thanks"
	await get_tree().create_timer(MESSAGE_TIME).timeout
		
func toggle_button(button, to_disable: bool):
	if to_disable:
		button.disabled = true
		button.modulate.a = 0.7
	else:
		button.disabled = false
		button.modulate.a = 1
	
func _on_no_thanks_pressed():
	SignalManager.change_screen_to.emit(start_screen)

func show_spinner():
	progress_spinner.visible = true
	message.visible = false
	
func hide_spinner():
	progress_spinner.visible = false
	
func show_message(msg):
	hide_spinner()
	
	message.visible = true
	message.text = msg
