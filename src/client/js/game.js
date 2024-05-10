import './play';
import './connection';
import '../../shared/packets/packet';
import PacketServerNameSelect from '../../shared/packets/packet-server-name-select';
import PacketServerChat from '../../shared/packets/packet-server-chat';
import { socket } from './connection';
import { startRender } from './render'

export function startGame() {
	console.log('Starting game render');
	startRender();
}

const confirmUsernameBtn = document.getElementById('confirmUsernameBtn');
confirmUsernameBtn.addEventListener('click', () => {
	const username = document.getElementById('usernameInput').value;

	let packet = new PacketServerNameSelect(username);
	packet.send(socket);
});

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
		// Focus on the chatbox input field
		document.getElementById('chatInput').focus();
	}
});

//Add a method to display an error message on the prompt
