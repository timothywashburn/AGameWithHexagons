import './play';
import './connection';
import '../../shared/packets/packet';
import PacketServerNameSelect from '../../shared/packets/packet-server-name-select';
import { socket } from './connection';

const confirmUsernameBtn = document.getElementById('confirmUsernameBtn');
confirmUsernameBtn.addEventListener('click', () => {
	const username = document.getElementById('usernameInput').value;

	let packet = new PacketServerNameSelect(username);
	packet.send(socket);
});

//Add a method to display an error message on the prompt
