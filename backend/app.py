from gevent import monkey
monkey.patch_all()

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv

# Import routes
from routes.auth import auth_bp
from routes.trips import trips_bp
from routes.ai import ai_bp
from routes.expenses import expenses_bp
from routes.community import community_bp

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("JWT_SECRET", "secret!")
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(trips_bp, url_prefix='/trips')
app.register_blueprint(ai_bp, url_prefix='/ai')
app.register_blueprint(expenses_bp, url_prefix='/expenses')
app.register_blueprint(community_bp, url_prefix='/community')

# Store memory (for chatbot)
chat_memory = {}

@app.route('/')
def home():
    return jsonify({"message": "TripGenie AI Backend is Running!"})

@socketio.on('connect')
def test_connect():
    print("Client connected to real-time socket")

@socketio.on('chat_message')
def handle_chat(data):
    from groq import Groq
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    user_message = data.get('message')
    if 'user' not in chat_memory:
        chat_memory['user'] = [{"role": "system", "content": "You are an AI travel agent."}]
        
    chat_memory['user'].append({"role": "user", "content": user_message})
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=chat_memory['user'],
            stream=True
        )
        full_reply = ""
        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                full_reply += content
                emit('chat_response', {'content': content}, broadcast=False)
                
        chat_memory['user'].append({"role": "assistant", "content": full_reply})
        emit('chat_response', {'content': '[DONE]'}, broadcast=False)
    except Exception as e:
        emit('chat_response', {'content': f"Error: {str(e)}"}, broadcast=False)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    socketio.run(app, host="0.0.0.0", port=port)