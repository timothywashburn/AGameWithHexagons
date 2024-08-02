import {BuildingSnapshot, ElementSnapshot, TroopSnapshot} from '../../../shared/interfaces/snapshot';
import ClientPlayer from './client-player';
import ClientElement from './client-element';

export default class ClientBuilding extends ClientElement {
    constructor(buildingSnapshot: BuildingSnapshot) {
        super(buildingSnapshot.id);

    //     TODO: Finish
    }

    updateBuilding(buildingSnapshot: BuildingSnapshot) {
    }
}