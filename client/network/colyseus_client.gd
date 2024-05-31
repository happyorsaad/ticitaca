extends Node

const SERVER_URL = "https://ticitaca-server.up.railway.app"
const colyseus = preload("res://addons/godot_colyseus/lib/colyseus.gd")
const schema = preload("res://network/game_schema.gd")

var room: colyseus.Room
var client

func get_client(ip):
	if not client:
		client = colyseus.Client.new(ip)
	return client
	
func join_or_create(options = null, ip = SERVER_URL) -> bool:
	var client = get_client(ip)
	var promise = client.join_or_create(schema.GameState, "game_room", options)
	return await connect_to_server(promise)
	
func join_room(room_id, options = null, ip = SERVER_URL) -> bool:
	var client = get_client(ip)
	var promise = client.join_by_id(schema.GameState, room_id, options)
	return await connect_to_server(promise)

func reconnect_to_room(reconnection_token, ip = SERVER_URL):
	var client = get_client(ip)
	var promise = client.reconnect(schema.GameState, reconnection_token)
	return await connect_to_server(promise)
	
func connect_to_server(promise) -> bool:
	await promise.completed
	
	if promise.get_state() == promise.State.Failed:
		print("Error", promise.get_state())
		return false
		
	var room_var: colyseus.Room = promise.get_data()
	var state: schema.GameState = room_var.get_state()
	
	room_var.on_state_change.on(_on_state)
	room_var.on_message("player_move").on(_on_message)
	room_var.on_message("chat_message").on(_on_chat)
	room_var.on_leave.on(_on_leave)
	self.room = room_var
	
	ReconnectionInfo.saveToken(room.reconnection_token)
	
	return true

func _on_leave():
	print("_on_leave")
	
func leave_room():
	self.room.leave(true)
	
func get_room_id():
	return room.room_id
	
func get_client_id():
	if not room:
		return null
	return room.session_id
	
func _on_state(state):
	SignalManager.on_game_state_change.emit(state)
	
func _on_message(message):
	SignalManager.on_message_received.emit("player_move", message)

func _on_chat(message):
	print("_on_chat", message)
	SignalManager.on_message_received.emit("chat_message", message)

func send_message(type, value):
	self.room.send(type, value)

func get_room_state() -> schema.GameState:
	if not self.room:
		return null
	return self.room.get_state()
