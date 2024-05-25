extends Node

const ReconnectionToken = preload("res://singletons/ReconnectionToken.gd")
const SAVE_FILE = "user://reconnection.tres"
const TIME_VALID = 5 * 60

func saveToken(token):
	var r_token = ReconnectionToken.new()
	r_token.reconnection_token = token
	r_token.timestamp = Time.get_unix_time_from_system()
	var error = ResourceSaver.save(r_token, SAVE_FILE)
	if error != OK:
		printerr("Failure! To Save The Reconnection Token")

func loadToken() -> ReconnectionToken:
	if ResourceLoader.exists(SAVE_FILE):
		var token = ResourceLoader.load(SAVE_FILE)
		if token is ReconnectionToken: # Check that the data is valid
			if Time.get_unix_time_from_system() - token.timestamp <= TIME_VALID: 
				return token
	return null
