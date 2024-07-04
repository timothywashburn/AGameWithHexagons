import PacketServerChat from "../../../shared/packets/packet-server-chat";
import { socket } from "../controllers/connection";

document.getElementById('chatSend').addEventListener('click', function() {
	const chatInput = document.getElementById('chatInput');
	if(chatInput.value === '') return;

	let packet = new PacketServerChat(chatInput.value);
	packet.send(socket);

	chatInput.value = '';
});

document.getElementById('chatInput').addEventListener('keypress', function(event) {
	if (event.key === 'Enter') {
		event.preventDefault(); // Prevent the default action (form submission)
		document.getElementById('chatSend').click();
	}
});

document.addEventListener('keypress', function (e) {
	if (e.key === 'Enter') {
		e.preventDefault();
		document.getElementById('chatInput').focus();
	}
});