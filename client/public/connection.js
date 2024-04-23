// import { PacketServerNameSelect } from './packets/packet-server-name-select.js';
let socket = io.connect();

socket.on('connect', () => {
	window.socketID = socket.id;
});

socket.on('packet', function(packet) {
	let PacketType = window.PacketType;
	let PacketServerNameSelect = window.PacketServerNameSelect;

	if(!packet.clients.includes(window.socketID) || !packet.type === PacketType.CLIENT_BOUND) return;

	if(packet.id === 0x01) {

		let packet = new PacketServerNameSelect('Player');
		packet.addClient(window.socketID);

		packet.send(socket);

		showCanvas();
	}
});


