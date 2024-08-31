import { ClientGame } from './client-game';

class ClientThePlayer {
	private game: ClientGame | null = null;

	getGame() {
		return this.game!;
	}

	setGame(game: ClientGame) {
		this.game = game;
	}

	isInGame() {
		return this.game != null;
	}
}

const thePlayer = new ClientThePlayer();

export default thePlayer;
