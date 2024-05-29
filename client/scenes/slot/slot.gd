extends Control

class_name Slot

@export var min_size = 128
@export var border_width = 1

var piece: PackedScene = preload("res://scenes/piece/piece.tscn")
var has_mouse = false
var is_empty = true: 
	get = _get_is_empty

func _get_is_empty() -> bool:
	return self.get_children().size() == 0
	
var slot_idx = -1 

var can_be_clicked

func _ready():
	custom_minimum_size = Vector2(min_size, min_size)
	self.can_be_clicked = false
	
func reset_slot():
	self.slot_idx = -1
	for child in self.get_children():
		child.queue_free()
	
func get_child_piece():
	if self.get_child_count() == 0:
		return null
	return self.get_children()[0]
	
func _draw():
	var size = min_size - 2 * border_width
	if has_mouse:
		draw_rect(Rect2(border_width, border_width, size, size),
			Color.LIGHT_YELLOW, 
			true, # filled
			border_width
		)
	
	draw_rect(Rect2(border_width, border_width, size, size),
		Color.BLACK, 
		false, # filled
		border_width
	)

func _on_mouse_entered():
	has_mouse = true
	queue_redraw()

func _on_mouse_exited():
	has_mouse = false
	queue_redraw()

func _on_gui_input(event):
	if not can_be_clicked:
		return
		
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.is_double_click():
		SignalManager.on_slot_doubleclicked.emit(slot_idx)
		return
		
	if event is InputEventScreenTouch and event.pressed:
		SignalManager.on_slot_doubleclicked.emit(slot_idx)
	
		
func _can_drop_data(at_position, data):
	return is_empty
	
func _drop_data(at_position, data):
	var parent: Control = data.parent;
	var node: Piece = data.node
	
	var new_child: Piece = piece.instantiate()
	new_child.piece_type = node.piece_type
	node.queue_free()
	
	SignalManager.on_piece_dropped.emit(slot_idx, node.piece_type)
	self.is_drag_successful()
	
	
	
