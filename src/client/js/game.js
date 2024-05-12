import './pages/play';
import './controllers/connection';
import './misc/ui'
import '../../shared/packets/packet';
import { startRender } from './render'

export function startGame() {
	console.log('Starting game render');
	startRender();
}

class Game {
	constructor() {
		this.resources = {
			"energy": 0,
			"goo": 0,
		}
		this.tiles = {}
	}
}