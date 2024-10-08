import { ClientGame } from './client-game';
import PlannedAction from '../../../shared/game/planned-action';

class ClientThePlayer {
	private game: ClientGame | null = null;
	private plannedActions: PlannedAction<any>[] = [];

	private id: number;

	getGame() {
		return this.game!;
	}

	setGame(game: ClientGame) {
		this.game = game;
	}

	isInGame() {
		return this.game != null;
	}

	getPlannedActions() {
		return [...this.plannedActions];
	}

	addPlannedAction(plannedAction: PlannedAction<any>) {
		this.plannedActions.push(plannedAction);
	}

	clearPlannedActions() {
		this.plannedActions = [];
	}

	getID() {
		return this.id;
	}

	setID(id: number) {
		this.id = id;
	}

	// TODO: Maybe later figure out a cleaner way of doing this
	getPlayer() {
		return this.getGame().getPlayer(this.getID())!;
	}
}

const thePlayer = new ClientThePlayer();

export default thePlayer;
