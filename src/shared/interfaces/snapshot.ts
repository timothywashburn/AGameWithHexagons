import { BuildingType, TroopType } from '../enums/unit-enums';
import { TurnType } from '../enums/gamestate-enums';

export interface ElementSnapshot {
	id: number;
}

export interface GameSnapshot {
	isAuthenticated: boolean;
	turnInfo: TurnInfo;
	resources: GameResources;
	players: PlayerSnapshot[];
	tiles: TileSnapshot[];
	troops: TroopSnapshot[];
	buildings: BuildingSnapshot[];
}

export interface TurnInfo {
	turn: number;
	type: TurnType;
}

export interface GameResources {
	energy: number;
	goo: number;
}

export interface PlayerSnapshot extends ElementSnapshot {
	color: string;
}

export interface TileSnapshot extends ElementSnapshot {
	x: number;
	y: number;
	color: string;
	troopID?: number;
	buildingID?: number;
}

export interface TroopSnapshot extends ElementSnapshot {
	type: TroopType;
	ownerID: number;
}

export interface BuildingSnapshot extends ElementSnapshot {
	type: BuildingType;
	ownerID: number;
}
