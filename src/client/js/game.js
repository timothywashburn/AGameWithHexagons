import './play';
import './connection';
import Packet from '../../shared/packets/packet';
import { PacketServerNameSelect } from '../../shared/packets/packet-server-name-select';

console.log(Packet);

const confirmUsernameBtn = document.getElementById('confirmUsernameBtn');
confirmUsernameBtn.addEventListener('click', () => {
	const username = document.getElementById('usernameInput').value;

	let packet = new PacketServerNameSelect(username);
	packet.addClient(window.socketID);

	packet.send(window.socket);
});
