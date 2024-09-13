import ServerGame from './server-game';
import ServerClient from './server-client';

export default abstract class ServerUnit {
	public id: number;
	public game: ServerGame;
	public owner: ServerClient;

	constructor(game: ServerGame, owner: ServerClient) {
		this.game = game;
		this.owner = owner;
		this.id = this.game.getNextID();
	}

	abstract destroy(): void;
}
