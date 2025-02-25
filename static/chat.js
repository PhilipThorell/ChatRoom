
let friends = [];
let messages = [];

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on("added_friend", function(data) {
    friends = data
});
socket.on("sent_message", function(data) {
    messages = data
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
    } else {
        alert("Please enter a message!");
    }
});
