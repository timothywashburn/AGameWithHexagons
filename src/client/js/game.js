let PacketServerNameSelect = window.PacketServerNameSelect;

const confirmUsernameBtn = document.getElementById('confirmUsernameBtn');
confirmUsernameBtn.addEventListener('click', () => {
	const username = document.getElementById('usernameInput').value;

	let packet = new PacketServerNameSelect(username);
	packet.addClient(window.socketID);

	packet.send(window.socket);
});
