let socket = io.connect();
socket.on('connect', () => {
	window.socketID = socket.id;
});
