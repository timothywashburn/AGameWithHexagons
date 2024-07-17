let nextID = 0;

export default class ServerBuilding {
	public id: number;
	public ownerID: number;

	constructor(ownerID: number) {
		this.id = nextID++;
		this.ownerID = ownerID;
	}
}
