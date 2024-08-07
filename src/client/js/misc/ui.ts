import PacketServerChat from '../../../shared/packets/server/packet-server-chat';
import { clientSocket } from '../controllers/connection';
import PacketServerSpawnUnit from '../../../shared/packets/server/packet-server-spawn-unit';
import { getGame } from '../objects/client-game';
import ClientTile from '../objects/client-tile';
import { BuildingType, TroopType } from '../../../shared/enums/unit-enums';

document.getElementById('chatSend')!.addEventListener('click', function () {
	const chatInput = document.getElementById('chatInput') as HTMLInputElement;
	if (chatInput.value === '') return;

	let packet = new PacketServerChat(chatInput.value);
	packet.sendToServer(clientSocket);

	chatInput.value = '';
});

document.getElementById('chatInput')!.addEventListener('keypress', function (event) {
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

document.getElementById('toggle-tile')!.addEventListener('click', function () {
	let game = getGame();
	if (game.selectedTile != null) {
		toggleSidebar('tile');
	}
});

document.getElementById('toggle-troop')!.addEventListener('click', function () {
	let game = getGame();
	if (game.selectedTile != null && game.selectedTile.troop != null) {
		toggleSidebar('troop');
	}
});

document.getElementById('toggle-building')!.addEventListener('click', function () {
	let game = getGame();
	if (game.selectedTile != null && game.selectedTile.building != null) {
		toggleSidebar('building');
	}
});

document.getElementById('spawn-troop1')!.addEventListener('click', function () {
	let packet = new PacketServerSpawnUnit('troop', TroopType.MELEE, getGame().selectedTile!.id);
	packet.sendToServer(clientSocket).then((response) => {
		if (!response.success) return;
		toggleSidebar('troop');
	});
});

document.getElementById('spawn-building1')!.addEventListener('click', function () {
	let packet = new PacketServerSpawnUnit('building', BuildingType.TOWER, getGame().selectedTile!.id);
	packet.sendToServer(clientSocket).then((response) => {
		if (!response.success) return;
		toggleSidebar('building');
	});
});

export function toggleSidebar(sidebar: 'tile' | 'troop' | 'building') {
	document.getElementById('sidebar-tile')!.style.display = 'none';
	document.getElementById('sidebar-troop')!.style.display = 'none';
	document.getElementById('sidebar-building')!.style.display = 'none';

	document.getElementById(`sidebar-${sidebar}`)!.style.display = 'block';
	showSidebarToggles(getGame().selectedTile!);

	if (sidebar === 'tile') setSidebarInfoTile();
	else if (sidebar === 'troop') setSidebarInfoTroop();
	else if (sidebar === 'building') setSidebarInfoBuilding();
}

export function showSidebarToggles(tile: ClientTile) {
	document.getElementById('toggle-tile')!.style.display = 'block';

	if (tile.troop != null) document.getElementById('toggle-troop')!.style.display = 'block';
	else document.getElementById('toggle-troop')!.style.display = 'none';

	if (tile.building != null) document.getElementById('toggle-building')!.style.display = 'block';
	else document.getElementById('toggle-building')!.style.display = 'none';
}

export function setSidebarInfoTile() {
	let game = getGame();
	document.getElementById('tile-name')!.innerText = `Tile ${game.selectedTile!.id}`;
}

export function setSidebarInfoTroop() {
	let game = getGame();
	document.getElementById('troop-name')!.innerText = `Troop ${game.selectedTile!.troop!.id}`;
}

export function setSidebarInfoBuilding() {
	let game = getGame();
	document.getElementById('building-name')!.innerText = `Building ${game.selectedTile!.building!.id}`;
}
