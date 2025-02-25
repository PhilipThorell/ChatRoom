from flask import Flask, render_template, request, redirect, url_for
from flask_socketio import SocketIO


app = Flask(__name__)
socketio = SocketIO(app)


clients = {}


@app.route("/")
def reroute():
    return redirect(url_for("login_page"))


@app.route("/login")
def login_page():
    return render_template("login.html")


@app.route("/chat")
def chat_room():
    #return render_template("chatroom.html")
    return "Welcome to the ChatRoom"


@socketio.on("connect")
def handle_connect():
    print(f"Client: {request.sid} connected!")


@socketio.on("clientInfo")
def handle_connect(info):
    username = info["name"]
    password = info["pass"]

    print(f"Client username: {username}")
    print(f"Client password: {password}")
    if username not in clients:
        clients[username] = {"password": password}
        socketio.emit("valid_username", {"valid": True, "redirect": "/chat"})
        return redirect(url_for("chat_room"))
    else:
        socketio.emit("valid_username", {"valid": False})


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)
