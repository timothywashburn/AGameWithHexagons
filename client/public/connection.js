let socket = io.connect();
window.socket = socket;

socket.on('connect', () => {
	window.socketID = socket.id;
});

socket.on('packet', function(packet) {
	let PacketType = window.PacketType;
	let NameErrorType = window.NameErrorType;

	if(!packet.clients.includes(window.socketID) || !packet.type === PacketType.CLIENT_BOUND) return;

	if(packet.id === 0x01) showCanvas();

	if(packet.id === 0x03) {
		if(packet.code === 0x00) {
			window.clientName = packet.name;

			let modal = document.getElementById('usernameModal');
			modal.classList.remove('show');
			modal.style.display = 'none';

			// Remove the backdrop
			let backdrops = document.getElementsByClassName('modal-backdrop');
			for(let i = 0; i < backdrops.length; i++) {
				backdrops[i].parentNode.removeChild(backdrops[i]);
			}
		}

		console.log(packet.code);
		console.log(NameErrorType);
		let error = Object.values(NameErrorType).find((error) => error.code === packet.code);
		document.getElementById('usernameError').innerHTML = error.message;

	}
});


