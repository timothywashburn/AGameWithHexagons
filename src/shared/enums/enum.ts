import { AnnouncementTypeEnum } from './packet/announcement-type';
import { TurnTypeEnum } from './game/turn-type';

export default class Enum {
	// Game
	static TurnType = new TurnTypeEnum();

	// Packet
	static AnnouncementType = new AnnouncementTypeEnum();
}
