import { toggleSidebar } from './ui-overlay';
import thePlayer from '../objects/client-the-player';
import ClientTroop from '../objects/client-troop';
import { platform } from 'os';
import ClientTile from '../objects/client-tile';
import { render } from 'ejs';
import assert from 'assert';
import CreateUnitAction, { CreateUnitActionData } from '../../../shared/game/actions/create-unit-action';
import MoveUnitAction, { MoveUnitActionData } from '../../../shared/game/actions/move-unit-action';
import { Pair } from '../../../shared/interfaces/pair';
import { calculateMoves, getAdjacentTiles } from '../../../shared/game/util';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let cameraX = 0;
let cameraY = 0;
let velocityX = 0;
let velocityY = 0;
let cameraZoom = 1;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;
const SCROLL_SENSITIVITY = 0.1;

let isMouseDown = false;
let isDragging = false;
let mouseDownTime: number;
let startPreDragX: number, startPreDragY: number;
let currentDragX: number, currentDragY: number;

let mouseX;
let mouseY;

export function prepareFrame() {
	if (canvas.width !== window.innerWidth || canvas.height !== window.innerWidth) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
	ctx.scale(cameraZoom, cameraZoom);
	ctx.translate(-window.innerWidth / 2 + cameraX, -window.innerHeight / 2 + cameraY);
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

canvas.addEventListener(
	'wheel',
	(event) => {
		const delta = Math.sign(event.deltaY) * -1;

		cameraZoom *= 1 + delta * SCROLL_SENSITIVITY;
		cameraZoom = Math.max(Math.min(cameraZoom, MAX_ZOOM), MIN_ZOOM);
	},
	{ passive: true }
);

canvas.addEventListener('mousedown', (event) => {
	if (event.button === 1) {
		cameraX = 0;
		cameraY = 0;
		velocityX = 0;
		velocityY = 0;
		cameraZoom = 1;
	} else if (event.button === 0) {
		isMouseDown = true;
		isDragging = false;
		mouseDownTime = Date.now();
		startPreDragX = event.clientX;
		startPreDragY = event.clientY;
	}
});

canvas.addEventListener('mouseup', (event) => {
	if (event.button === 0) {
		if (!isDragging) stationaryClick(event);
		isMouseDown = false;
		isDragging = false;
	}
});

const stationaryClick = (event: MouseEvent) => {
	let clickedTile = getTile(event.clientX, event.clientY);
	setSelectedTile(clickedTile);
};

export function setSelectedTile(clickedTile: ClientTile | undefined | null, override = false) {
	let game = thePlayer.getGame();

	if (clickedTile && clickedTile.isMoveOption) {
		let game = thePlayer.getGame();
		let selectedTile = game.selectedTile;

		if (clickedTile && selectedTile && selectedTile.troop) attemptMove(selectedTile.troop, clickedTile);
		return;
	}

	disableMoveOptionRendering();

	if (game.selectedTile == clickedTile && !override) {
		game.selectedTile = null;

		document.getElementById('sidebar')!.style.display = 'none';
	} else if (clickedTile != null) {
		game.selectedTile = clickedTile;

		document.getElementById('sidebar')!.style.display = 'block';
		if (game.selectedTile.troop != null) toggleSidebar('troop');
		else if (game.selectedTile.building != null) toggleSidebar('building');
		else toggleSidebar('tile');
	}
}

canvas.addEventListener('mousemove', (event) => {
	mouseX = event.clientX;
	mouseY = event.clientY;

	if (isMouseDown && !isDragging) {
		let deltaX = startPreDragX - mouseX;
		let deltaY = startPreDragY - mouseY;
		let distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

		if (distance > 7 || Date.now() - mouseDownTime > 125) {
			isDragging = true;
			currentDragX = startPreDragX;
			currentDragY = startPreDragY;
		}
	}

	if (isDragging) {
		let deltaX = event.clientX - currentDragX;
		let deltaY = event.clientY - currentDragY;
		cameraX += deltaX / cameraZoom;
		cameraY += deltaY / cameraZoom;
		currentDragX = event.clientX;
		currentDragY = event.clientY;
	}

	let hoveredTile = getTile(mouseX, mouseY);
	for (let tile of thePlayer.getGame().tiles) {
		tile.isHovered = hoveredTile === tile;
	}
});

const getTile = (canvasX: number, canvasY: number) => {
	for (let tile of thePlayer.getGame().tiles) {
		if (ctx.isPointInPath(tile.path!, canvasX, canvasY)) {
			return tile;
		}
	}
};

export function renderTroopMoveOptions(troop: ClientTroop) {
	let tile = troop.getParentTile();
	let renderTiles: Pair<number>[] = getAdjacentTiles(tile.x, tile.y);
	let speed = troop.speed;

	renderTiles = renderTiles.filter((pair) => {
		let tile = thePlayer.getGame().getTileByPosition(pair.first, pair.second);
		if (tile === null) return false;

		return tile.troop == null && tile.building == null;
	});

	for (let i = 0; i < speed - 1; i++) {
		let isOccupied = function (pair: Pair<number>) {
			let tile = thePlayer.getGame().getTileByPosition(pair.first, pair.second);
			if (tile === null) return false;

			return tile.troop != null || tile.building != null;
		};

		renderTiles = calculateMoves(renderTiles, isOccupied);
	}

	renderTiles.forEach((pair) => {
		let tile = thePlayer.getGame().getTileByPosition(pair.first, pair.second);
		if (tile === null) return;

		tile.isMoveOption = true;
	});
}

export function disableMoveOptionRendering() {
	thePlayer.getGame().tiles.forEach((tile) => (tile.isMoveOption = false));
}

function attemptMove(troop: ClientTroop, tile: ClientTile) {
	let actionData: MoveUnitActionData = {
		troopID: troop.id,
		tileID: tile.id
	};
	new MoveUnitAction(actionData);

	troop.hasMoved = true;

	setTimeout(() => {
		tile.isMoveOption = false;
		setSelectedTile(tile);
	}, 100);
}
