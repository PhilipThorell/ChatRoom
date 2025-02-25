valid_user;

socket.on("valid_username", function(data) {
    valid_user = data;
});



document.getElementById("submitBtn").addEventListener("click", function () {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    socket.emit("clientInfo", {name: usernameInput.value,
                               pass: passwordInput.value});

    if (valid_user) {
        // let user enter
    } else {
        // username already taken
    }
})