import Tile from "../../client/js/objects/tile";

let nextID = 0;

class ServerTroop {

	public id: number;
	public ownerID: number;
	public parentTile: Tile;

	constructor(ownerID, parentTile) {
		this.id = nextID++;
		this.ownerID = ownerID;
		this.parentTile = parentTile;
	}

	getClientTroopData(client) {
		return {
			id: this.id,
			ownerID: this.ownerID,
			parentTileID: this.parentTile.id
		}
	}
}

module.exports = {
	ServerTroop: ServerTroop
}
