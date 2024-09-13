import { ClientUnitState } from '../../../shared/enums/game/client-unit-state';
import ClientElement from './client-element';

export default abstract class ClientUnit extends ClientElement {
	protected constructor(id: number) {
		super(id);
	}

	abstract render(): void;
}
