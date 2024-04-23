let socket = io.connect();

socket.on('connect', () => {
	window.socketID = socket.id;
});

socket.on('packet', function(packet) {
	if (!packet.clients.includes(window.socketID)) return;

	if (packet.id === 0x01) {
		showCanvas();
	}
});


