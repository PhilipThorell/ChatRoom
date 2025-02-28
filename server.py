from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO
import json


app = Flask(__name__)
app.secret_key = "your_secret_key"
socketio = SocketIO(app)

connected_clients = {}
client_cur_chat = {}


with open("database.json", "r") as json_read:
    database = json.load(json_read)


def save_database():
    with open("database.json", "w") as json_write:
        json.dump(database, json_write, indent=2)


@app.route("/")
def reroute():
    return redirect(url_for("login_page"))


@app.route("/login", methods=["GET", "POST"])
def login_page():
    error = None

    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        # Store the username and room in the session
        session["username"] = username
        session["password"] = password

        print(f"Client username: {username}")
        print(f"Client password: {password}")

        if username not in database["users"]:
            database["users"][username] = {"password": password, "friends": []}
            save_database()
            return redirect(url_for("chat_room"))
        else:
            if password == database["users"][username]["password"]:
                return redirect(url_for("chat_room"))
            else:
                error = "Invalid password try again"

    return render_template("login.html", error=error)


@app.route("/chat", methods=["GET", "POST"])
def chat_room():
    username = session.get('username')
    print(f"Hello {username}")
    if not username:
        return redirect(url_for("login_page"))

    friends = database["users"][username]["friends"]

    return render_template("chatroom.html",
                           username=username,
                           friends=friends)


@socketio.on("connect")
def handle_connect():
    username = session.get("username")
    if username:
        connected_clients[username] = request.sid
        print(f"Client: {username} connected to chat with SID: {request.sid}")


@socketio.on("add_friend")
def handle_friend(data):
    username = data["username"]
    friend = data["friend"]

    if friend in database["users"]:
        if friend in database["users"][username]["friends"]:
            return
        database["users"][username]["friends"].append(friend)
        database["users"][friend]["friends"].append(username)
        save_database()

        if username in connected_clients:
            socketio.emit("added_friend",
                          database["users"][username]["friends"],
                          room=connected_clients[username])
        if friend in connected_clients:
            socketio.emit("added_friend",
                          database["users"][friend]["friends"],
                          room=connected_clients[friend])


@socketio.on("open_chat")
def show_chat(friend):
    username = session.get("username")
    client_cur_chat[username] = friend

    for chat in database["chatrooms"]:
        if username in chat and friend in chat:
            messages = database["chatrooms"][chat]
            break
    else:
        database["chatrooms"][f"{friend} {username}"] = []
        messages = []

    if username in connected_clients:
        socketio.emit("show_chat",
                      {"messages": messages, "friend": friend, "user": username},
                      room=connected_clients[username])


@socketio.on("message")
def handle_message(data):
    msg = data["msg"]
    friend = data["friend"]
    username = session.get("username")
    messages = None

    for chat in database["chatrooms"]:
        if username in chat and friend in chat:
            database["chatrooms"][chat].append({username: msg})
            messages = database["chatrooms"][chat]
            break

    save_database()

    if messages:
        if username in connected_clients:
            socketio.emit("update_chat", messages,
                          room=connected_clients[username])
        if friend in connected_clients and client_cur_chat[friend] == username:
            socketio.emit("update_chat",
                          {"messages": messages, "user": username},
                          room=connected_clients[friend])


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)
