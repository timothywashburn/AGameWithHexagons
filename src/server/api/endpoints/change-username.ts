import { Endpoint, endpoints } from '../endpoint';
import { AuthData } from '../endpoint';
import { isUsernameTaken, isUsernameValid, verifyToken } from '../../controllers/authentication';
import { runQuery } from '../../controllers/sql';
import { NameChangeResponse } from '../../../shared/enums/account/name-change-response';
import Enum from '../../../shared/enums/enum';

class ChangeUsername extends Endpoint {
	getParameters(): string[] {
		return ['username'];
	}

	async call(parameters: string[], authData: AuthData): Promise<string | object> {
		let username = parameters[0];

		return changeUsername(authData.token, username)
			.then(async (result: NameChangeResponse) => {
				return {
					result: result.getIndex()
				};
			})
			.catch((error: unknown) => {
				console.error('Error changing username');
				console.error(error);
				return {
					result: Enum.NameChangeResponse.ERROR.getIndex()
				};
			});
	}

	requiresAuthentication(): boolean {
		return true;
	}
}

export async function changeUsername(token: string, newUsername: string): Promise<NameChangeResponse> {
	if (!(await isUsernameValid(newUsername))) return Enum.NameChangeResponse.USERNAME_INVALID;
	if (await isUsernameTaken(newUsername)) return Enum.NameChangeResponse.USERNAME_EXISTS;

	try {
		const decoded = verifyToken(token);
		await runQuery('UPDATE accounts SET username = ? WHERE id = ?', [newUsername, decoded.userId]);
		return Enum.NameChangeResponse.SUCCESS;
	} catch {
		return Enum.NameChangeResponse.ERROR;
	}
}

endpoints.push(new ChangeUsername());
