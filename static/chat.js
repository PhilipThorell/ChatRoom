let activeFriend = "";

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on("added_friend", function(friends) {
    display_friends(friends);
});
socket.on("show_chat", function(message_data) {
    messages = message_data.messages;
    friend = message_data.friend;
    display_messages(messages);
});
socket.on("update_chat", function(messages) {
    display_messages(messages);
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

function display_friends(friends) {
    // Get the container element
    const container = document.getElementById("friendsList");

    // Loop through the list and add each item as a new paragraph
    friends.forEach((friend, index) => {
        const button = document.createElement("button"); // Create a new <button> element
        button.id = "friend-btn-${index}"
        button.textContent = friend; // Set its text content to the item
        container.appendChild(button); // Append it to the container

        button.addEventListener("click", function() {
            activeFriend = friend;
            socket.emit("open_chat", friend);
        });
    });
}
function display_messages(messages) {
    const container = document.getElementById("showBox"); // change to messagesBox
    //container.innerHTML = "";  // Clear existing messages

    messages.forEach((message, index) => {
        let name = Object.keys(message)[0];
        let text = message[name];
        const pMessage = document.createElement("p");
        pMessage.id = `message-${index}`;
        pMessage.textContent = `${name}: ${text}`;
        container.appendChild(pMessage);
    });
}

display_friends(friends);
