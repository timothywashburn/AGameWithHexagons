const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let start, previousTimeStamp;

let radius = 50;
const size = 10;
let offsetX = 100;
let offsetY = 100;

let isDragging = false;
let startX, startY;

let frame = 0;
let renderTimes = []
export function step() {
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
	radius *= 1 + delta * 0.1;
	if (radius * size * 4 < screen.height) radius = screen.height / size / 4;
	if (radius > screen.height / 4) radius = screen.height / 4;
});

canvas.addEventListener('mousedown', event => {
	if (event.button === 1) {
		radius = 50;
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
	let centerX = offsetX + canvas.width / 2 - (size - 1) * radius * Math.cos(Math.PI / 6);
	let centerY = offsetY + canvas.height / 2 - (size - 1) * (radius + radius * Math.sin(Math.PI / 6));

	const rotationAngle = 30 * Math.PI / 180;

	for (let row = 0; row < size * 2 - 1; row++) {
		for (let col = 0; col < size * 2 - 1; col++) {
			let minimum = -size + row;
			let maximum = size + row;
			if(col > maximum - 1 || col < minimum + 1) continue;

			let x = centerX + radius * 3 / 2 * col * Math.cos(rotationAngle) - radius * Math.sqrt(3) * (row - col / 2) * Math.sin(rotationAngle);
			let y = centerY + radius * 3 / 2 * col * Math.sin(rotationAngle) + radius * Math.sqrt(3) * (row - col / 2) * Math.cos(rotationAngle);

			drawHexagon(x, y);
		}
	}
}

function drawHexagon(x, y) {
	ctx.beginPath();
	for (let i = 0; i < 6; i++) {
		let px = x + radius * Math.cos(Math.PI / 3 * i + Math.PI / 6);
		let py = y + radius * Math.sin(Math.PI / 3 * i + Math.PI / 6);
		ctx.lineTo(px, py);
	}
	ctx.closePath();

	ctx.stroke();
}