let nextID = 0;

class ServerTroop {
	constructor(ownerID) {
		this.id = nextID++;
		this.ownerID = ownerID;
	}
}
