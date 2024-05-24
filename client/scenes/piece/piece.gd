extends Control

class_name Piece

const Schema = preload("res://network/game_schema.gd")
const PieceType = Schema.PieceType

var piece_type = PieceType.SMALL_0
var min_size = 128
var can_be_dragged = true

var small_size = min_size * 0.5
var large_size = min_size * 0.75

const PIECE_COLOR = {
	PieceType.SMALL_0 : Color.GREEN_YELLOW,
	PieceType.LARGE_0 : Color.SEA_GREEN,
	PieceType.SMALL_1 : Color.SKY_BLUE,
	PieceType.LARGE_1 : Color.DEEP_SKY_BLUE,
	PieceType.NO_PIECE : Color.WHITE,
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
	
func _ready():
	var size = get_piece_size()
	custom_minimum_size = Vector2(min_size, min_size)

func _draw():
	var color = PIECE_COLOR[piece_type]
	var position = Vector2(min_size/2, min_size/2)
	var size = get_piece_size()
	draw_circle(position, size/2, color)
	
func _get_drag_data(position):
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
	var preview_piece: Piece = Piece.new()
	preview_piece.piece_type = self.piece_type
	preview_piece.custom_minimum_size = self.custom_minimum_size / 2
	
	var c = Control.new()
	c.add_child(preview_piece)
	preview_piece.position = -0.75 * preview_piece.custom_minimum_size

	return c

	
