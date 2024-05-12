const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let apothem, radius;
const size = 5;

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

let frame = 1;
let renderTimes = []

let mouseX;
let mouseY;

const hexagon = new Image();
hexagon.src = 'images/hexagon.svg';

export function startRender() {
	setApothem(30);
	step();
}

function step() {
	const renderStartTime = window.performance.now();

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
	ctx.scale(cameraZoom, cameraZoom);
	ctx.translate(-window.innerWidth / 2 + cameraX, -window.innerHeight / 2 + cameraY);
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

	drawGrid();

	const finalRenderTime = window.performance.now() - renderStartTime;
	renderTimes.push(finalRenderTime);

	frame++;
	requestAnimationFrame(step);
}

setInterval(() => {
	console.log((renderTimes.reduce((a, b) => a + b) / renderTimes.length).toFixed(2) + "ms per step")
	renderTimes.clear();
}, 5000);

canvas.addEventListener('wheel', event => {
	const delta = Math.sign(event.deltaY) * -1;

	cameraZoom *= 1 + delta * SCROLL_SENSITIVITY;
	cameraZoom = Math.max(Math.min(cameraZoom, MAX_ZOOM), MIN_ZOOM);
});

canvas.addEventListener('mousedown', event => {
	if (event.button === 1) {
		setApothem(50);
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

function drawGrid() {
	let centerX = canvas.width / 2;
	let centerY = canvas.height / 2;

	// drawHexagon(centerX, centerY);

	for (let row = -size + 1; row < size; row++) {
		// let coords = [];
		// coords.push(row);

		for (let column = Math.abs(row) - (size - 1) * 2; column <= -Math.abs(row) + (size - 1) * 2; column += 2) {
			// coords.push(column);
			let hexagonX = centerX + column * apothem;
			let hexagonY = centerY - row * radius * (1 + Math.sin(Math.PI / 6));
			drawHexagon(hexagonX, hexagonY);
		}

		// console.log(coords.join("  "));
	}
}

function drawHexagon(hexagonX, hexagonY) {

	let hexagonRegion = new Path2D();
	for (let i = 0; i < 6; i++) {
		let pointX = hexagonX + radius * Math.cos(Math.PI / 3 * i + Math.PI / 6);
		let pointY = hexagonY + radius * Math.sin(Math.PI / 3 * i + Math.PI / 6);
		if(i === 0) {
			hexagonRegion.moveTo(pointX, pointY);
		} else hexagonRegion.lineTo(pointX, pointY);
	}
	hexagonRegion.closePath();

	ctx.save();
	ctx.fillStyle = getRBGAround(134, 44, 54, 0);
	ctx.fill(hexagonRegion);
	ctx.restore();

	ctx.save();
	ctx.drawImage(hexagon, hexagonX - radius, hexagonY - radius, radius * 2, radius * 2);
	ctx.restore();

	ctx.stroke(hexagonRegion);
}

function calculateRadius() {
	radius = apothem / Math.cos(Math.PI / 6);
}

function setApothem(newApothem) {
	apothem = newApothem;
	calculateRadius()
}