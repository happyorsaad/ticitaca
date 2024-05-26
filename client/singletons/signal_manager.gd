extends Node

signal change_screen_to
signal on_game_state_change(state)
signal on_piece_dropped(idx, piece_type)
signal on_slot_doubleclicked(idx)
signal on_message_received(type, message)
signal on_connection_dropped()
