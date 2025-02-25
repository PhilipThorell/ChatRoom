

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on("valid_username", function(data) {
    if (data.valid) {
        // If username is valid, redirect to /chat
        window.location.href = data.redirect;
    } else {
        // If username is already taken, alert the user
        alert("Username already taken. Please choose another one.");
    }
});



document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    socket.emit("clientInfo", {
        name: username,
        pass: password
    });
});
