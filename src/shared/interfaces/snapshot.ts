import PlannedAction from '../game/planned-action';

export interface ElementSnapshot {
	id: number;
}

export type GameInitData = GameSnapshot & {
	plannedActions: PlannedAction<any>[];
};

export interface GameSnapshot {
	isRunning: boolean;
	isAuthenticated: boolean;
	turnNumber: number;
	turnTypeIndex: number;
	resources: GameResources;
	players: PlayerSnapshot[];
	tiles: TileSnapshot[];
	troops: TroopSnapshot[];
	buildings: BuildingSnapshot[];
}

export interface GameResources {
	energy: number;
	goo: number;
}

export interface PlayerSnapshot extends ElementSnapshot {
	colorIndex: number;
}

export interface TileSnapshot extends ElementSnapshot {
	x: number;
	y: number;
	color: string;
	troopID?: number;
	buildingID?: number;
}

export interface TroopSnapshot extends ElementSnapshot {
	typeIndex: number;
	ownerID: number;
}

export interface BuildingSnapshot extends ElementSnapshot {
	typeIndex: number;
	ownerID: number;
}
