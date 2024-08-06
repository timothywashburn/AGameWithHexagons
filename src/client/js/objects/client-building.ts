import {BuildingSnapshot, ElementSnapshot, TroopSnapshot} from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import ClientElement from './client-element';
import {getGame} from './client-game';

export default class ClientBuilding extends ClientElement {
    constructor(buildingSnapshot: BuildingSnapshot) {
        super(buildingSnapshot.id);

        getGame().buildings.push(this);
    }

    updateBuilding(buildingSnapshot: BuildingSnapshot) {
    }
}