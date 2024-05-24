extends Node

func is_equal_dict(dictionary_one, dictionary_two):
	if dictionary_one == dictionary_two:
		return true
	
	if dictionary_one == null or dictionary_two == null:
		return false
		
	if dictionary_one.hash() == dictionary_two.hash():
		return true
		
	for key in dictionary_one:
		if not dictionary_two.has(key):
			return false
		var tv = dictionary_one[key]
		if typeof(tv) == TYPE_DICTIONARY:
			if !is_equal_dict(tv, dictionary_two[key]):
				return false
		elif tv != dictionary_two[key]:
			return false
	
	return true
	
		
