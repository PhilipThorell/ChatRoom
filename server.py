from flask import Flask, render_template, request
from flask_socketio import SocketIO


app = Flask(__name__)
socketio = SocketIO(app)


clients = {}


@app.route("/")
def home_page():
    return render_template("index.html")


@socketio.on("connect")
def handle_connect():
    print(f"Client: {request.sid} connected!")
    clients[request.sid] = {"messages": []}


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)
