extends Control

@onready var chat_input = $VBoxContainer/Input
@onready var chat_panel = $VBoxContainer/ChatPanel
@onready var chat_list = $VBoxContainer/ChatPanel/ChatList
@onready var chat_sound = $ChatSound
@onready var onscreen_keyboard = $VBoxContainer/OnscreenKeyboard

const COLORS = [
	Color.LIGHT_GREEN,
	Color.SKY_BLUE
]

const CHAT_BUBBLE = preload("res://scenes/chat/chat_bubble.tscn")

var is_open = false

const MIN_HEIGHT = 1000

var my_name

func _ready():
	chat_panel.custom_minimum_size.y = MIN_HEIGHT
	
	SignalManager.on_message_received.connect(_on_message)

func _on_message(type, message): 
	var my_id = Client.get_client_id()
	var players = Client.get_room_state().players
	var my_idx = players.at(my_id).idx
	var other_idx = (my_idx + 1) % 2
	
	if type == "chat_message":
		if message["sessionId"] == my_id and not message.has("local"):
			return
	
		var bubble: ChatBubble  = CHAT_BUBBLE.instantiate()
		chat_list.add_child(bubble)
		bubble.display_text(message["message"])
		
		if message["sessionId"] == my_id:
			bubble.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
			bubble.modulate = COLORS[my_idx]
		else:
			show_toast(message["message"])
			bubble.size_flags_horizontal = Control.SIZE_SHRINK_END
			bubble.modulate = COLORS[other_idx]
			
		await chat_panel.get_v_scroll_bar().changed
		chat_panel.scroll_vertical = chat_panel.get_v_scroll_bar().max_value + 100
		chat_list.add_child(HSeparator.new())

func show_toast(text):
	chat_sound.play()
		
func _on_input_text_submitted(new_text):
	chat_input.text = ""
	onscreen_keyboard.visible = false
	SignalManager.on_message_received.emit("chat_message", {
		"sessionId" : Client.get_client_id(),
		"name": my_name,
		"message": new_text,
		"local" : true
	})
	Client.send_message("chat_message", {
		"message": new_text
	})

func _on_input_focus_entered():
	if OS.has_feature("web_android") or OS.has_feature("web_ios"):
		onscreen_keyboard.visible = true
	
