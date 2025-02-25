

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on("invalid_password", function() {
    // If username is already taken, alert the user
    alert("Incorrect password, or the username you entered already exists");
});
