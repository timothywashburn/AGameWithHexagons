const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let start, previousTimeStamp;

let apothem, radius;
const size = 10;
let offsetX = 0;
let offsetY = 0;

let isDragging = false;
let startX, startY;

let frame = 0;
let renderTimes = []

export function startRender() {
	setApothem(50);
	step();
}

function step() {
	const renderStartTime = window.performance.now();

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// drawGrid(canvas.width, canvas.height);

	drawGrid();

	const finalRenderTime = window.performance.now() - renderStartTime;
	renderTimes.push(finalRenderTime);
	if(frame % 165 === 0) console.log((renderTimes.reduce((a, b) => a + b) / renderTimes.length).toFixed(2) + "ms per step");
	if(renderTimes.length > 165) renderTimes.shift();
	frame++;

	requestAnimationFrame(step);
}

canvas.addEventListener('wheel', event => {
	const delta = Math.sign(event.deltaY) * -1;
	setApothem(apothem * (1 + delta * 0.1));
	if (apothem * size * 4 < screen.height) setApothem(screen.height / size / 4);
	if (apothem > screen.height / 4) setApothem(screen.height / 4);
});

canvas.addEventListener('mousedown', event => {
	if (event.button === 1) {
		setApothem(50);
		offsetX = 0;
		offsetY = 0;
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
	if (isDragging) {
		let deltaX = event.clientX - startX;
		let deltaY = event.clientY - startY;
		offsetX += deltaX;
		offsetY += deltaY;
		startX = event.clientX;
		startY = event.clientY;
	}
});

function drawGrid() {
	let centerX = offsetX + canvas.width / 2;
	let centerY = offsetY + canvas.height / 2;

	drawHexagon(centerX, centerY);

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
	ctx.beginPath();
	for (let i = 0; i < 6; i++) {
		let pointX = hexagonX + radius * Math.cos(Math.PI / 3 * i + Math.PI / 6);
		let pointY = hexagonY + radius * Math.sin(Math.PI / 3 * i + Math.PI / 6);
		ctx.lineTo(pointX, pointY);
	}
	ctx.closePath();

	ctx.stroke();
}

function calculateRadius() {
	radius = apothem / Math.cos(Math.PI / 6);
}

function setApothem(newApothem) {
	apothem = newApothem;
	calculateRadius()
}