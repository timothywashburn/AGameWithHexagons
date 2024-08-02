import PacketServerChat from "../../../shared/packets/server/packet-server-chat";
import { clientSocket } from "../controllers/connection";
import PacketServerSpawnUnit from '../../../shared/packets/server/packet-server-spawn-unit';
import { getGame } from '../objects/client-game';

const sidebar = document.getElementById('sidebar') as HTMLCanvasElement;
const sidebarTile = document.getElementById('sidebar-tile') as HTMLCanvasElement;
const sidebarTroop = document.getElementById('sidebar-troop') as HTMLCanvasElement;

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
	console.log("spawning troop 1");
	let packet = new PacketServerSpawnUnit(getGame().selectedTile!.id, 0);
	packet.sendToServer(clientSocket);
});

// Debug function for switching between UI sidebars
// TODO: create centralized method for toggling between troop and tile sidebars, may need a client-ui class
document.addEventListener('keydown', event => {
	if (event.key === ' ') {
		switch (sidebar.style.getPropertyValue('--content-display')) {
			case 'tile':
				sidebarTile.style.display = 'none';
				sidebarTroop.style.display = 'block';
				sidebar.style.setProperty('--content-display', 'troop');
				break;
			case 'troop':
				sidebarTile.style.display = 'block';
				sidebarTroop.style.display = 'none';
				sidebar.style.setProperty('--content-display', 'tile');
				break;
			default:
				sidebarTile.style.display = 'block';
				sidebarTroop.style.display = 'none';
				sidebar.style.setProperty('--content-display', 'tile');
		}
	}
});
