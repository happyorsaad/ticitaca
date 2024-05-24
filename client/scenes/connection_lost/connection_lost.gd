extends Control

var start_screen = preload("res://scenes/start/start.tscn")

func _on_leave_pressed():
	SignalManager.change_screen_to.emit(start_screen)
