import { AnnouncementTypeEnum } from './packet/announcement-type';
import { NameChangeResponseEnum } from './account/name-change-response';
import { EmailChangeResponseEnum } from './account/email-change-response';
import { PasswordChangeResponseEnum } from './account/password-change-response';
import { RegistrationResponseEnum } from './account/registration-response';
import { AccountToastMessageEnum } from './account/account-toast-message';
import { TeamColorEnum } from './game/team-color';
import { BuildingTypeEnum } from './game/building-type';
import { TurnTypeEnum } from './game/turn-type';
import { TroopTypeEnum } from './game/troop-type';
import { ActionTypeEnum } from './game/action-type';
import { ClientUnitStateEnum } from './game/client-unit-state';
import { ClientPacketTypeEnum } from './packet/client-packet-type';
import { PacketDestinationEnum } from './packet/packet-destination';
import { ServerPacketTypeEnum } from './packet/server-packet-type';

export default class Enum {
	// Account
	static AccountToastMessage = new AccountToastMessageEnum();
	static EmailChangeResponse = new EmailChangeResponseEnum();
	static NameChangeResponse = new NameChangeResponseEnum();
	static PasswordChangeResponse = new PasswordChangeResponseEnum();
	static RegistrationResponse = new RegistrationResponseEnum();

	// Game
	static ActionType = new ActionTypeEnum();
	static BuildingType = new BuildingTypeEnum();
	static ClientUnitState = new ClientUnitStateEnum();
	static TeamColor = new TeamColorEnum();
	static TroopType = new TroopTypeEnum();
	static TurnType = new TurnTypeEnum();

	// Packet
	static AnnouncementType = new AnnouncementTypeEnum();
	static ClientPacketType = new ClientPacketTypeEnum();
	static PacketDestination = new PacketDestinationEnum();
	static ServerPacketType = new ServerPacketTypeEnum();
}
