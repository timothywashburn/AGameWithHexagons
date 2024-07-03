const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let apothem = 30
let radius = apothem / Math.cos(Math.PI / 6);

const hexagon = new Image();
const hexagonSelected = new Image();
const hexagonHover = new Image();
hexagon.src = 'images/hexagon.svg';
hexagonSelected.src = 'images/hexagon-selected.svg';
hexagonHover.src = 'images/hexagon-hover.svg';

export default class Tile {
	constructor(x, y, terrainType) {
		this.x = x;
		this.y = y;

		if((this.x + this.y) % 2 !== 0) {
			throw new Error(`Tile at ${this.x}, ${this.y} is not valid`);
		}

		this.color = getRBGAround(134, 44, 54, 40);
		// this.occupant = occupant;
		// this.terrainType = terrainType;
		// this.resourceType = resourceType;
		// this.isObscured = isObscured;

		this.isSelected = false;
		this.isHovered = false;
	}

	render() {
		this.literalX = canvas.width / 2 + this.x * apothem;
		this.literalY = canvas.height / 2 - this.y * radius * (1 + Math.sin(Math.PI / 6));

		this.path = new Path2D();
		for (let i = 0; i < 6; i++) {
			let pointX = this.literalX + radius * Math.cos(Math.PI / 3 * i + Math.PI / 6);
			let pointY = this.literalY + radius * Math.sin(Math.PI / 3 * i + Math.PI / 6);
			if(i === 0) {
				this.path.moveTo(pointX, pointY);
			} else this.path.lineTo(pointX, pointY);
		}
		this.path.closePath();

		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fill(this.path);
		ctx.restore();

		ctx.save();
		ctx.drawImage(this.getImage(), this.literalX - radius, this.literalY - radius, radius * 2, radius * 2);
		ctx.restore();

		ctx.stroke(this.path);
	}

	getImage() {
		if (this.isSelected) return hexagonSelected;
		if (this.isHovered) return hexagonHover;
		return hexagon;
	}
}

function getRBGAround(red, green, blue, random) {
	let randomMultiplier = Math.random();
	let getRandom = value => value + randomMultiplier * random - random / 2;
	return `rgb(${getRandom(red)}, ${getRandom(green)}, ${getRandom(blue)}`;
}