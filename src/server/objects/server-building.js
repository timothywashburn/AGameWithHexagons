let nextID = 0;

class ServerBuilding {
	constructor(ownerID) {
		this.id = nextID++;
		this.ownerID = ownerID;
	}
}
