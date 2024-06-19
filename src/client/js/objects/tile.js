const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let apothem = 30
let radius = apothem / Math.cos(Math.PI / 6);

const hexagon = new Image();
hexagon.src = 'images/hexagon.svg';

export default class Tile {
	constructor(x, y, terrainType) {
		this.x = x;
		this.y = y;
		this.color = getRBGAround(134, 44, 54, 40);
		// this.occupant = occupant;
		// this.terrainType = terrainType;
		// this.resourceType = resourceType;
		// this.isObscured = isObscured;
	}

	render() {
		let hexagonX = canvas.width / 2 + this.x * apothem;
		let hexagonY = canvas.height / 2 - this.y * radius * (1 + Math.sin(Math.PI / 6));

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
		ctx.fillStyle = this.color;
		ctx.fill(hexagonRegion);
		ctx.restore();

		ctx.save();
		ctx.drawImage(hexagon, hexagonX - radius, hexagonY - radius, radius * 2, radius * 2);
		ctx.restore();

		ctx.stroke(hexagonRegion);
	}
}

function getRBGAround(red, green, blue, random) {
	let randomMultiplier = Math.random();
	let getRandom = value => value + randomMultiplier * random - random / 2;
	return `rgb(${getRandom(red)}, ${getRandom(green)}, ${getRandom(blue)}`;
}