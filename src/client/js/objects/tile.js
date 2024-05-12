class Tile {
	constructor(x, y, terrainType) {
		this.x = x;
		this.y = y;
		this.color = getRBGAround(terrainType.color);
		// this.occupant = occupant;
		// this.terrainType = terrainType;
		// this.resourceType = resourceType;
		// this.isObscured = isObscured;
	}
}

function getRBGAround(color, random) {
	return `rgb(${color.red + Math.random() * random - random / 2}, ${color.green + Math.random() * random - random / 2}, ${color.blue + Math.random() * random - random / 2})`;
}