
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

document.getElementById("messageBtn").addEventListener("click", function () {
    let message = document.getElementById("message").value;
    socket.emit("message", message);
});
