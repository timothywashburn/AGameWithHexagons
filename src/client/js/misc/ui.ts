import PacketServerChat from "../../../shared/packets/packet-server-chat";
import { clientSocket } from "../controllers/connection";

(document.getElementById('chatSend') as HTMLElement).addEventListener('click', function() {
	const chatInput = document.getElementById('chatInput') as HTMLInputElement;
	if(chatInput.value === '') return;

	let packet = new PacketServerChat(chatInput.value);
	packet.send(clientSocket);

	chatInput.value = '';
});

(document.getElementById('chatInput') as HTMLElement).addEventListener('keypress', function(event) {
	if (event.key === 'Enter') {
		event.preventDefault(); // Prevent the default action (form submission)
		(document.getElementById('chatSend') as HTMLElement).click();
	}
});

document.addEventListener('keypress', function (e) {
	if (e.key === 'Enter') {
		e.preventDefault();
		(document.getElementById('chatInput') as HTMLElement).focus();
	}
});
