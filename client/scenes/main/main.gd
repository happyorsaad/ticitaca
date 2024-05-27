extends Control

var start_scene = preload("res://scenes/start/start.tscn")
var reconnect_screen = preload("res://scenes/reconnect/reconnect.tscn")
var curr_scene

@onready var game_music: AudioStreamPlayer2D = $GameMusic

func _ready():
	_change_scene_to(start_scene)
	game_music.stop()
	game_music.play()
	SignalManager.change_screen_to.connect(_change_scene_to)

func _change_scene_to(scene: PackedScene):
	if curr_scene:
		curr_scene.queue_free()
	var next_scene = scene.instantiate()
	add_child(next_scene)
	curr_scene = next_scene
	
