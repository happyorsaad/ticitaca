extends Control

class_name Piece

enum EMOTION {
	SMART,
	ANGRY,
	SAD,
	ANNOYED,
	CUTE,
	TEASE,
	TOO_SMART
}

const Schema = preload("res://network/game_schema.gd")
const PieceType = Schema.PieceType

@export var piece_type = PieceType.SMALL_0
var min_size = 128
var can_be_dragged = true
var emotion = null

var small_size = min_size * 0.6
var large_size = min_size * 0.75

const FACE_ANGRY = preload("res://assets/piece/Double/face_g.png")
const FACE_SAD = preload("res://assets/piece/Double/face_i.png")
const FACE_SMART = preload("res://assets/piece/Double/face_h.png")
const FACE_ANNOYED = preload("res://assets/piece/Double/face_b.png")
const FACE_CUTE = preload("res://assets/piece/Double/face_d.png")
const FACE_TEASE = preload("res://assets/piece/Double/face_f.png")
const FACE_TOO_SMART = preload("res://assets/piece/Double/face_e.png")

const EMOTION_ICON = {
	EMOTION.SMART : FACE_SMART,
	EMOTION.ANGRY : FACE_ANGRY,
	EMOTION.SAD : FACE_SAD,
	EMOTION.ANNOYED : FACE_ANNOYED,
	EMOTION.CUTE: FACE_CUTE,
	EMOTION.TEASE: FACE_TEASE,
	EMOTION.TOO_SMART: FACE_TOO_SMART
}

const PIECE_COLOR = {
	PieceType.SMALL_0 : {
		"base_color" : Color.LIGHT_GREEN,
		"face_texture" : EMOTION_ICON[EMOTION.SMART] 
	},
	PieceType.LARGE_0 : {
		"base_color" : Color.MEDIUM_SEA_GREEN,
		"face_texture" : EMOTION_ICON[EMOTION.ANGRY] 
	},
	PieceType.SMALL_1 : {
		"base_color" : Color.SKY_BLUE,
		"face_texture" : EMOTION_ICON[EMOTION.SMART]
	},
	PieceType.LARGE_1 : {
		"base_color" : Color.LIGHT_SKY_BLUE,
		"face_texture" : EMOTION_ICON[EMOTION.ANGRY]  
	},
	PieceType.NO_PIECE : {
	
	},
}

func get_piece_size():
	match piece_type:
		PieceType.SMALL_0:
			return small_size
		PieceType.SMALL_1:
			return small_size
		PieceType.LARGE_0:
			return large_size
		PieceType.LARGE_1:
			return large_size
		PieceType.NO_PIECE:
			return large_size

func get_default_emotion():
	match piece_type:
		PieceType.SMALL_0:
			return EMOTION.SMART
		PieceType.SMALL_1:
			return EMOTION.SMART
		PieceType.LARGE_0:
			return EMOTION.ANGRY
		PieceType.LARGE_1:
			return EMOTION.ANGRY
		PieceType.NO_PIECE:
			return large_size
			
func _ready():
	var size = get_piece_size()
	custom_minimum_size = Vector2(min_size, min_size)

func _draw():
	var size = get_piece_size()
	var size_vec = Vector2(size, size)
	var position = Vector2(min_size/2, min_size/2)
	var offset = Vector2(15,15)
	if piece_type == PieceType.NO_PIECE:
		draw_circle(position, size/2, Color.WHITE)
		return 
	
	var face = PIECE_COLOR[piece_type]["face_texture"]
	var color = PIECE_COLOR[piece_type]["base_color"]
	
	if emotion:
		face = EMOTION_ICON[emotion]
		
	var style_box: StyleBoxFlat = StyleBoxFlat.new()
	style_box.set_corner_radius_all(15)
	style_box.bg_color = color
	draw_style_box(style_box, Rect2(position - size_vec / 2, size_vec))
	draw_texture_rect(face, Rect2(position - size_vec / 2 + offset, size_vec / 2), false)
	
func _get_drag_data(position):
	if piece_type == PieceType.NO_PIECE:
		return null
	
	if not can_be_dragged:
		return null
	
	set_drag_preview(create_preview_control()) 
	var drag_data = {
		"type": "piece_data",
		"node": self,
		"parent": self.get_parent()
	}
	return drag_data

func create_preview_control():
	var preview_piece = Piece.new()
	preview_piece.piece_type = self.piece_type
	preview_piece.custom_minimum_size = self.custom_minimum_size / 2
	
	var c = Control.new()
	c.add_child(preview_piece)
	preview_piece.position = -0.75 * preview_piece.custom_minimum_size

	return c

