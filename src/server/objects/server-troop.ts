import ServerTile from './server-tile';
import ServerClient from './server-client';
import {TroopInitData} from '../../shared/interfaces/init-data';

let nextID = 0;

export default class ServerTroop {
	public id: number;
	public ownerID: number;
	public parentTile: ServerTile;

	constructor(ownerID: number, parentTile: ServerTile) {
		this.id = nextID++;
		this.ownerID = ownerID;
		this.parentTile = parentTile;
	}

	getClientTroopData(client: ServerClient): TroopInitData {
		return {
			id: this.id,
			ownerID: this.ownerID,
			parentTileID: this.parentTile.id
		}
	}
}
