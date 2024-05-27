extends Node

const ReconnectionToken = preload("res://singletons/ReconnectionToken.gd")
const SAVE_FILE = "user://reconnection.tres"
const TIME_VALID = 5 * 60

func saveToken(token):
	DirAccess.remove_absolute(SAVE_FILE)
	
	if not token:
		return
	
	var r_token = ReconnectionToken.new()
	r_token.reconnection_token = token
	r_token.timestamp = str(Time.get_unix_time_from_system())
	print("save token : ", r_token.timestamp, " -- ", r_token.reconnection_token)
	var error = ResourceSaver.save(r_token, SAVE_FILE)
	if error != OK:
		printerr("Failure! To Save The Reconnection Token")

func loadToken() -> ReconnectionToken:
	if ResourceLoader.exists(SAVE_FILE):
		var token = ResourceLoader.load(SAVE_FILE)
		if token is ReconnectionToken: # Check that the data is valid
			print("load token : ", token.timestamp, " -- ", token.reconnection_token)
			print(Time.get_unix_time_from_system() - float(token.timestamp))
			
			if not token.reconnection_token:
				return null
			
			if Time.get_unix_time_from_system() - float(token.timestamp) <= TIME_VALID: 
				print(token.reconnection_token)
				return token
	return null
