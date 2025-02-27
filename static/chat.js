var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on("added_friend", function(data) {
    friends = data;
});
socket.on("show_chat", function(message_data) {
    display_messages(message_data)
});
socket.on("sent_message", function(data) {
    messages = data;
});

document.getElementById("friendBtn").addEventListener("click", function (event) {
    event.preventDefault();
    const friendName = document.getElementById("searchbar").value;

    if (friendName) {
        document.getElementById("searchbar").value = "";
        socket.emit("add_friend", {"username": username, "friend": friendName});
    } else {
        alert("Please enter a friends name!");
    }
});

document.getElementById("messageBtn").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission
    const textMessage = document.getElementById("message").value.trim();

    if (textMessage) {
        document.getElementById("message").value = ""; // Clear input
        socket.emit("message", textMessage);
    } //else {
    //    alert("Please enter a message!");
    //}
});

function display_friends() {
    // Get the container element
    const container = document.getElementById("friendsList");

    // Loop through the list and add each item as a new paragraph
    friends.forEach((friend, index) => {
        const button = document.createElement("button"); // Create a new <p> element
        button.id = "friend-btn-${index}"
        button.textContent = friend; // Set its text content to the item
        container.appendChild(button); // Append it to the container

        button.addEventListener("click", function() {
            socket.emit("open_chat", friend);
        });
    });
}
function display_messages(message_data) {
    let messages = message_data.messages;
    let friend = message_data.messages;
    const container = document.getElementById("showBox"); // change to messagesBox

    messages.forEach((message, index) => {
        let name = Object.keys(message)[0];
        let text = message[name];
        console.log(name);
        console.log(text);
        const pMessage = document.createElement("p");
        pMessage.id = "message-${index}"
        pMessage.textContent = text;
        container.appendChild(pMessage);
    });
}

display_friends();
