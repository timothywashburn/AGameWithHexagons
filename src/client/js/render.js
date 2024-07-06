import { getGame } from './objects/game';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
let mouseDownTime;
let startPreDragX, startPreDragY;
let currentDragX, currentDragY;

let mouseX;
let mouseY;

export function prepareFrame() {
	if(canvas.width !== window.innerWidth || canvas.height !== window.innerWidth) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
	ctx.scale(cameraZoom, cameraZoom);
	ctx.translate(-window.innerWidth / 2 + cameraX, -window.innerHeight / 2 + cameraY);
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

canvas.addEventListener('wheel', event => {
	const delta = Math.sign(event.deltaY) * -1;

	cameraZoom *= 1 + delta * SCROLL_SENSITIVITY;
	cameraZoom = Math.max(Math.min(cameraZoom, MAX_ZOOM), MIN_ZOOM);
}, {passive: true});

canvas.addEventListener('mousedown', event => {
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

canvas.addEventListener('mouseup', event => {
	if (event.button === 0) {
		if(!isDragging) stationaryClick(event);
		isMouseDown = false;
		isDragging = false;
	}
});

const stationaryClick = event => {
	let clickedTile = getTile(event.clientX, event.clientY);
	if (clickedTile != null && clickedTile.isSelected) {
		clickedTile.isSelected = false;
	} else {
		for (let tile of getGame().tiles) {
			tile.isSelected = clickedTile === tile;
		}
	}
}

canvas.addEventListener('mousemove', event => {
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
	for (let tile of getGame().tiles) {
		tile.isHovered = hoveredTile === tile;
	}
});

const getTile = (mouseX, mouseY) => {
	for (let tile of getGame().tiles) {
		if (ctx.isPointInPath(tile.path, mouseX, mouseY)) {
			return tile;
		}
	}
}