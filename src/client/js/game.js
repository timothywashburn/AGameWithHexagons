import './play';
import './connection';
import '../../shared/packets/packet';
import { PacketServerNameSelect } from '../../shared/packets/packet-server-name-select';

const confirmUsernameBtn = document.getElementById('confirmUsernameBtn');
confirmUsernameBtn.addEventListener('click', () => {
	const username = document.getElementById('usernameInput').value;

	let packet = new PacketServerNameSelect(username);
	packet.send(window.socket);
});

//Add a method to display an error message on the prompt
