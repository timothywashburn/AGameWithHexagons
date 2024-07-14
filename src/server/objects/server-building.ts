let nextID = 0;

class ServerBuilding {
	public id: number;
	public ownerID: number;

	constructor(ownerID) {
		this.id = nextID++;
		this.ownerID = ownerID;
	}
}
