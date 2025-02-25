document.getElementById("submitBtn").addEventListener("click", function () {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    socket.emit("clientInfo", {name: usernameInput.value,
                               pass: passwordInput.value})
})