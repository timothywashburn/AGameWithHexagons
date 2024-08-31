import { ClientGame } from './client-game';
import PlannedAction from '../../../shared/game/planned-action';

class ClientThePlayer {
	private game: ClientGame | null = null;
	private plannedActions: PlannedAction[] = [];

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

	addPlannedAction(plannedAction: PlannedAction) {
		this.plannedActions.push(plannedAction);
	}

	clearPlannedActions() {
		this.plannedActions = [];
	}
}

const thePlayer = new ClientThePlayer();

export default thePlayer;
