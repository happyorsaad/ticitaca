extends CanvasLayer

var multiplayer_scene : PackedScene = preload("res://scenes/multiplayer_controls/multiplayer_controls.tscn")

func _on_multiplayer_pressed():
	SignalManager.change_screen_to.emit(multiplayer_scene)
		
