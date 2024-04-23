// import { PacketServerNameSelect } from './packets/packet-server-name-select.js';
let socket = io.connect();

socket.on('connect', () => {
	window.socketID = socket.id;
});

socket.on('packet', function(packet) {
	if (!packet.clients.includes(window.socketID)) return;

	if (packet.id === 0x01) {

		let PacketServerNameSelect = window.PacketServerNameSelect;
		let packet = new PacketServerNameSelect('Player');
		packet.addClient(window.socketID);

		packet.send(socket);

		showCanvas();
	}
});


