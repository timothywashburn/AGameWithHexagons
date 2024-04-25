const confirmUsernameBtn = document.getElementById('confirmUsernameBtn');
confirmUsernameBtn.addEventListener('click', () => {
    let PacketServerNameSelect = window.PacketServerNameSelect;

    const username = document.getElementById('usernameInput').value;

    let packet = new PacketServerNameSelect(username);
    packet.addClient(window.socketID);

    packet.send(window.socket);
});

//Add a method to display an error messahe on the prompt
