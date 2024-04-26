import './play';
import './connection';
import '../../shared/packets/packet';
import PacketServerNameSelect from '../../shared/packets/packet-server-name-select';
import PacketServerChat from '../../shared/packets/packet-server-chat';
import { socket } from './connection';

const confirmUsernameBtn = document.getElementById('confirmUsernameBtn');
confirmUsernameBtn.addEventListener('click', () => {
	const username = document.getElementById('usernameInput').value;

	let packet = new PacketServerNameSelect(username);
	packet.send(socket);
});

document.getElementById('chatSend').addEventListener('click', function() {
	const chatInput = document.getElementById('chatInput');
	const chatMessages = document.getElementById('chatMessages');

	let packet = new PacketServerChat(chatInput.value);
	packet.send(socket);

	chatInput.value = '';
});

//Add a method to display an error message on the prompt
