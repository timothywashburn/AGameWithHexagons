import { PacketType } from '../../shared/packets/packet';
import { showCanvas } from './play';
import { io } from 'socket.io-client';
let socket = io.connect();
window.socket = socket;

socket.on('connect', () => {
	window.socketID = socket.id;
});

socket.on('packet', function (packet) {
	if (!packet.clients.includes(window.socketID) || !packet.type === PacketType.CLIENT_BOUND) return;

	if (packet.id === 0x01) showCanvas();
});
