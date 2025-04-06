let activeFriend = "";
online_clients = [];

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on("added_friend", function(friends) {
    display_friends(friends);
});
socket.on("show_chat", function(message_data) {
    messages = message_data.messages;
    friend = message_data.friend;
    user = message_data.user;
    display_messages(messages, user);
});
socket.on("update_chat", function(message_data) {
    messages = message_data.messages;
    user = message_data.user;
    display_messages(messages, user);
});
socket.on("update_users_status", function(online_clients_list) {
    online_clients = online_clients_list;
    display_friends(friends);
});

document.getElementById("friendBtn").addEventListener("click", function () {
    const friendName = document.getElementById("searchbar").value;

    if (friendName) {
        document.getElementById("searchbar").value = "";
        socket.emit("add_friend", {"username": username, "friend": friendName});
    } else {
        alert("Please enter a friends name!");
    }
});

document.getElementById("messageBtn").addEventListener("click", function () {
    const textMessage = document.getElementById("message").value.trim();

    if (!activeFriend) {
        alert("not in a chat");
    }

    else if (textMessage) {
        document.getElementById("message").value = ""; // Clear input
        socket.emit("message", {"msg": textMessage, "friend": activeFriend});
    }
});

const container = document.getElementById("friendsColumn");
function display_friends(friends) {
    container.innerHTML = "";
    // Loop through the list and add each item as a new paragraph
    friends.forEach((friend, index) => {
        const friend_wrapper = document.createElement("div");
        friend_wrapper.style.display = "flex";
        friend_wrapper.style.alignItems = "center";
        friend_wrapper.style.marginBottom = "10px";
        friend_wrapper.style.gap = "8px";

        const button = document.createElement("button"); // Create a new <button> element
        button.className = "selectFriend";
        button.textContent = friend;

        button.addEventListener("click", function() {
            activeFriend = friend;
            socket.emit("open_chat", friend);
        });

        const dot = document.createElement('span');
        dot.classList.add('dot');

        // Choose color based on online status
        const isOnline = online_clients.includes(friend);
        const status_color = isOnline ? "green" : "lightgrey";


        const canvas = document.createElement("canvas");
        canvas.width = 20;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');

        // Draw a circle
        ctx.beginPath();
        ctx.arc(10, 10, 6, 0, Math.PI * 2); // x, y, radius
        ctx.fillStyle = status_color; // Circle color
        ctx.fill();

        friend_wrapper.appendChild(canvas);
        friend_wrapper.appendChild(button);

        container.appendChild(friend_wrapper);
        container.appendChild(document.createElement("br"));
    });

    // Auto-scroll to the bottom
    container.scrollTop = container.scrollHeight;
}
function display_messages(messages, user) {
    const container = document.getElementById("displayMessages");
    container.innerHTML = "";  // Clear existing messages

    messages.forEach((message, index) => {
        let name = Object.keys(message)[0];
        let text = message[name];

        const messageDiv = document.createElement("div");
        messageDiv.className = "message-container";

        const pName = document.createElement("p");
        pName.className = "messages";
        pName.textContent = `${name}`;

        const pMessage = document.createElement("p");
        pMessage.className = "messages";
        pMessage.textContent = `${text}`;

        if (name === user) {
            pName.id = "username";
            pMessage.id = "userMsg";
        } else {
            pName.id = "receiver";
            pMessage.id = "receiverMsg";
        }
        container.appendChild(pName);
        container.appendChild(pMessage);
        container.appendChild(messageDiv);
    });

    container.scrollTop = container.scrollHeight;
}


display_friends(friends);
