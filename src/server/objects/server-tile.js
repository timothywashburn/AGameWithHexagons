let nextID = 0;

class ServerTile {
    troop;
    building;

    constructor(x, y) {
        this.id = nextID++;
        this.x = x;
        this.y = y;
    }
}

module.exports = {
    ServerTile: ServerTile
}
