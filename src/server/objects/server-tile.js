let nextID = 0;

class ServerTile {
    occupantTroop;
    occupantBuilding;

    constructor(x, y) {
        this.id = nextID++;
        this.x = x;
        this.y = y;
        this.color = getRBGAround(134, 44, 54, 40);
    }

    getClientTileData(client) {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            color: this.color
        }
    }
}

function getRBGAround(red, green, blue, random) {
    let randomMultiplier = Math.random();
    let getRandom = value => value + randomMultiplier * random - random / 2;
    return `rgb(${getRandom(red)}, ${getRandom(green)}, ${getRandom(blue)}`;
}

module.exports = {
    ServerTile: ServerTile
}
