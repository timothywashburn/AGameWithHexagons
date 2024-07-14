let nextID = 0;

export default class ServerTroop {
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