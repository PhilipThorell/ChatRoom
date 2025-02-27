from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO
import json


app = Flask(__name__)
app.secret_key = "your_secret_key"
socketio = SocketIO(app)


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


@socketio.on("connect")
def handle_connect():
    print(f"Client: {request.sid} connected to chat!")


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


@socketio.on("add_friend")
def handle_friend(data):
    database["users"][data["username"]]["friends"].append(data["friend"])
    save_database()
    socketio.emit("added_friend", database["users"][data["username"]]["friends"])


@socketio.on("open_chat")
def show_chat(friend):
    user = session.get("username")
    for chat in database["chatrooms"]:
        if user in chat and friend in chat:
            messages = database["chatrooms"][f"{friend} {user}"]
            break
    else:
        database["chatrooms"][f"{friend} {user}"] = []
        messages = []
    socketio.emit("show_chat", {"messages": messages, "friend": friend})


@socketio.on("message")
def handle_message(data):
    save_database()
    socketio.emit("sent_message", 0)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True, allow_unsafe_werkzeug=True)
