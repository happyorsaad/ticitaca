extends MarginContainer

class_name ChatBubble

@onready var chat_message = $Margin/ChatMessage

const MAX_WIDTH = 750

var text = ""

func _ready():
	display_text("")
	
func display_text(text_to_display: String):
	print("chat_message" , chat_message, text_to_display)
	
	if not chat_message:
		return 
		
	text = text_to_display
	chat_message.text = text_to_display
	
	await resized
	
	custom_minimum_size.x = min(size.x, MAX_WIDTH)
	
	if size.x > MAX_WIDTH:
		chat_message.autowrap_mode = TextServer.AUTOWRAP_WORD
		await resized
		await resized
		custom_minimum_size.y = size.y
	
	global_position.x -= size.x / 2
	global_position.y = size.y + 24
	
