session_data = {}

def set_session(data):
    global session_data
    session_data = data

def get_session():
    return session_data

def clear_session():
    global session_data
    session_data = {}