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
import { JoinStateEnum } from './misc/join-state';
import { ActionTypeEnum } from './game/action-type';
import { ClientUnitStateEnum } from './game/client-unit-state';

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

	// Misc
	static JoinState = new JoinStateEnum();

	// Packet
	static AnnouncementType = new AnnouncementTypeEnum();
}
