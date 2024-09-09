import PacketServerChat from '../../../shared/packets/server/packet-server-chat';
import { clientSocket } from './connection';
import ClientTile from '../objects/client-tile';
import PacketServerEndTurn from '../../../shared/packets/server/packet-server-end-turn';
import PacketServerDev from '../../../shared/packets/server/packet-server-dev';
import Enum from '../../../shared/enums/enum';
import thePlayer from '../objects/client-the-player';
import CreateUnitAction, { CreateUnitActionData } from '../../../shared/game/actions/create-unit-action';

document.getElementById('chatSend')!.addEventListener('click', () => {
	const chatInput = document.getElementById('chatInput') as HTMLInputElement;
	if (chatInput.value === '') return;

	let packet = new PacketServerChat(chatInput.value);
	packet.sendToServer(clientSocket);

	chatInput.value = '';
});

document.getElementById('chatInput')!.addEventListener('keypress', (event) => {
	if (event.key === 'Enter') {
		event.preventDefault();
		document.getElementById('chatSend')!.click();
	}
});

document.addEventListener('keypress', (e) => {
	if (e.key === 'Enter') {
		e.preventDefault();
		document.getElementById('chatInput')!.focus();
	}
});

document.getElementById('toggle-tile')!.addEventListener('click', () => {
	let game = thePlayer.getGame();
	if (game.selectedTile != null) {
		toggleSidebar('tile');
	}
});

document.getElementById('toggle-troop')!.addEventListener('click', () => {
	let game = thePlayer.getGame();
	if (game.selectedTile != null && game.selectedTile.troop != null) {
		toggleSidebar('troop');
	}
});

document.getElementById('toggle-building')!.addEventListener('click', () => {
	let game = thePlayer.getGame();
	if (game.selectedTile != null && game.selectedTile.building != null) {
		toggleSidebar('building');
	}
});

document.getElementById('end-turn-button')!.addEventListener('click', () => {
	let packet = new PacketServerEndTurn(thePlayer.getPlannedActions());

	const button = document.getElementById('end-turn-button') as HTMLButtonElement;
	button.disabled = true;

	packet.sendToServer(clientSocket).then((reply) => {
		if (reply.success) {
			const turnText = document.getElementById('turn-text') as HTMLInputElement;
			turnText.textContent = 'Waiting for Players';
		} else {
			button.disabled = false;
		}
	});
});

document.getElementById('start-game-button')!.addEventListener('click', () => {
	let packet = new PacketServerDev({
		action: 'START_GAME'
	});

	packet.sendToServer(clientSocket);

	const button = document.getElementById('start-game-button') as HTMLButtonElement;
	button.style.display = 'none';
});

export function updateTurnText() {
	const turnText = document.getElementById('turn-text') as HTMLInputElement;
	turnText.textContent = `Turn ${thePlayer.getGame().turnNumber}: ${thePlayer.getGame().turnType.displayName}`;
}

export function populateSpawnButtons() {
	for (let i = 0; i < Enum.TroopType.size(); i++) {
		let troopType = Enum.TroopType.getFromIndex(i);
		let newButton = document.createElement('button');
		newButton.appendChild(document.createTextNode(troopType.displayName));
		newButton.id = `spawn-troop-${troopType.getIndex()}`;

		newButton.addEventListener('click', () => {
			let actionData: CreateUnitActionData = {
				category: 'troop',
				unitIndex: troopType.getIndex(),
				tileID: thePlayer.getGame().selectedTile!.id
			};
			new CreateUnitAction(actionData);
			// TODO: Add support for in progress units
			// toggleSidebar('troop');
		});
		document.getElementById('troop-spawn-options')!.appendChild(newButton);
	}

	for (let i = 0; i < Enum.BuildingType.size(); i++) {
		let buildingType = Enum.BuildingType.getFromIndex(i);
		let newButton = document.createElement('button');
		newButton.appendChild(document.createTextNode(buildingType.displayName));
		newButton.id = `spawn-building-${buildingType.getIndex()}`;

		newButton.addEventListener('click', () => {
			let actionData: CreateUnitActionData = {
				category: 'building',
				unitIndex: buildingType.getIndex(),
				tileID: thePlayer.getGame().selectedTile!.id
			};
			new CreateUnitAction(actionData);
			// TODO: Add support for in progress units
			// toggleSidebar('building');
		});
		document.getElementById('building-spawn-options')!.appendChild(newButton);
	}
}

export function toggleSidebar(sidebar: 'tile' | 'troop' | 'building') {
	document.getElementById('sidebar-tile')!.style.display = 'none';
	document.getElementById('sidebar-troop')!.style.display = 'none';
	document.getElementById('sidebar-building')!.style.display = 'none';

	document.getElementById(`sidebar-${sidebar}`)!.style.display = 'block';
	showSidebarToggles(thePlayer.getGame().selectedTile!);

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
	let thisTile = thePlayer.getGame().selectedTile!;
	document.getElementById('tile-name')!.innerText = `Tile ${thisTile.id}`;
}

export function setSidebarInfoTroop() {
	let thisTroop = thePlayer.getGame().selectedTile!.troop!;
	document.getElementById('troop-name')!.innerText = `Troop ${thisTroop.id}`;
	document.getElementById('troop-class')!.innerText = `${thisTroop.type.displayName}`;

	let moveButton = document.getElementById('troop-move');
	if (!thisTroop.hasMoved && thisTroop.owner.id === thePlayer.getID()) moveButton!.style.display = "block";
	else moveButton!.style.display = "none";
}

export function setSidebarInfoBuilding() {
	let thisBuilding = thePlayer.getGame().selectedTile!.building!;
	document.getElementById('building-name')!.innerText = `Building ${thisBuilding.id}`;
	document.getElementById('building-class')!.innerText = `${thisBuilding.type.displayName}`;
}
