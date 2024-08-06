import PacketServerChat from "../../../shared/packets/server/packet-server-chat";
import { clientSocket } from "../controllers/connection";
import PacketServerSpawnUnit from '../../../shared/packets/server/packet-server-spawn-unit';
import { getGame } from '../objects/client-game';

document.getElementById('chatSend')!.addEventListener('click', function() {
	const chatInput = document.getElementById('chatInput') as HTMLInputElement;
	if(chatInput.value === '') return;

	let packet = new PacketServerChat(chatInput.value);
	packet.sendToServer(clientSocket);

	chatInput.value = '';
});

document.getElementById('chatInput')!.addEventListener('keypress', function(event) {
	if (event.key === 'Enter') {
		event.preventDefault(); // Prevent the default action (form submission)
		document.getElementById('chatSend')!.click();
	}
});

document.addEventListener('keypress', function (e) {
	if (e.key === 'Enter') {
		e.preventDefault();
		document.getElementById('chatInput')!.focus();
	}
});

document.getElementById('spawn-troop1')!.addEventListener('click', function() {
	let packet = new PacketServerSpawnUnit(0, getGame().selectedTile!.id);
	packet.sendToServer(clientSocket);
	document.getElementById('sidebar-tile')!.style.display = 'none';
	document.getElementById('sidebar-troop')!.style.display = 'block';
});

// TODO: create centralized method for toggling between troop and tile sidebars, may need a client-ui class\
document.getElementById('toggle-tile')!.addEventListener('click', function() {
	if (getGame().selectedTile != null) {
		document.getElementById('sidebar-tile')!.style.display = 'block';
		document.getElementById('sidebar-troop')!.style.display = 'none';
		document.getElementById('sidebar-building')!.style.display = 'none';
	}
});

document.getElementById('toggle-troop')!.addEventListener('click', function() {
	if (getGame().selectedTile != null && getGame().selectedTile!.troop != null) {
		document.getElementById('sidebar-troop')!.style.display = 'block';
		document.getElementById('sidebar-tile')!.style.display = 'none';
		document.getElementById('sidebar-building')!.style.display = 'none';
	}
});

document.getElementById('toggle-building')!.addEventListener('click', function() {
	if (getGame().selectedTile != null && getGame().selectedTile!.building != null) {
		document.getElementById('sidebar-building')!.style.display = 'block';
		document.getElementById('sidebar-tile')!.style.display = 'none';
		document.getElementById('sidebar-troop')!.style.display = 'none';
	}
});
