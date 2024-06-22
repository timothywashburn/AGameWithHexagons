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

let isDragging = false;
let startX, startY;

let mouseX;
let mouseY;

const hexagon = new Image();
hexagon.src = 'images/hexagon.svg';

export function prepareFrame() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

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
		isDragging = true;
		startX = event.clientX;
		startY = event.clientY;
	}
});

canvas.addEventListener('mouseup', event => {
	if (event.button === 0) {
		isDragging = false;
	}
});

canvas.addEventListener('mousemove', event => {
	mouseX = event.clientX;
	mouseY = event.clientY;

	if (isDragging) {
		let deltaX = event.clientX - startX;
		let deltaY = event.clientY - startY;
		cameraX += deltaX / cameraZoom;
		cameraY += deltaY / cameraZoom;
		startX = event.clientX;
		startY = event.clientY;
	}
});