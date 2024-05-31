extends Control

var start_scene = preload("res://scenes/start/start.tscn")
var reconnect_screen = preload("res://scenes/reconnect/reconnect.tscn")
var curr_scene

@onready var music_btn: TextureButton = $MarginContainer/Music
@onready var game_music: AudioStreamPlayer2D = $GameMusic

const AUDIO_OFF = preload("res://assets/ui/audio_off.png")
const AUDIO_ON = preload("res://assets/ui/audio_on.png")

var music = true

func _ready():
	_change_scene_to(start_scene)
	game_music.stop()
	game_music.play()
	music_btn.texture_normal = AUDIO_ON
	SignalManager.change_screen_to.connect(_change_scene_to)

func _change_scene_to(scene: PackedScene):
	if curr_scene:
		curr_scene.queue_free()
	var next_scene = scene.instantiate()
	add_child(next_scene)
	curr_scene = next_scene

func _on_music_pressed():
	music = not music
	if music:
		music_btn.texture_normal = AUDIO_ON
		if not game_music.playing:
			game_music.play()
	else:
		music_btn.texture_normal = AUDIO_OFF
		if game_music.playing:
			game_music.stop()
		
