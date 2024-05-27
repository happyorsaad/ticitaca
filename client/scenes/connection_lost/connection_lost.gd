extends Control

var start_screen = preload("res://scenes/start/start.tscn")

func _on_leave_pressed():
	SignalManager.change_screen_to.emit(start_screen)

func _on_reconnect_timeout():
	print("_on_reconnect_timeout")
	var token: ReconnectionToken = ReconnectionInfo.loadToken()
	if token:
		var result = await Client.reconnect_to_room(token.reconnection_token)	
		if result:
			var new_state = Client.get_room_state()
			SignalManager.on_reconnection.emit(new_state)
			
