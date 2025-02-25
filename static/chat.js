
let friends = [];
let messages = [];

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on("added_friend", function(data) {
    friends = data
});
socket.on("sent_message", function(data) {
    messages = data
});

document.getElementById("friendBtn").addEventListener("click", function () {

});

document.getElementById("messageBtn").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission
    const messageInput = document.getElementById("message").value.trim();

    if (messageInput) {
        console.log("Message sent:", messageInput);
        document.getElementById("message").value = ""; // Clear input
    } else {
        alert("Please enter a message!");
    }

    socket.emit("message", messageInput);
});
