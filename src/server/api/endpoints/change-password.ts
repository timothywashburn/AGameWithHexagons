import { Endpoint, endpoints } from '../endpoint';
import { AuthData } from '../endpoint';
import * as auth from '../../controllers/authentication';
import { hashPassword, verifyPassword, verifyToken } from '../../controllers/authentication';
import { runQuery } from '../../controllers/sql';
import { PasswordChangeResponse } from '../../../shared/enums/account/password-change-response';
import Enum from '../../../shared/enums/enum';

class ChangePassword extends Endpoint {
	getParameters(): string[] {
		return ['oldPassword', 'newPassword'];
	}

	async call(parameters: string[], authData: AuthData): Promise<string | object> {
		let oldPassword = parameters[0];
		let newPassword = parameters[1];

		return changePassword(authData.token, oldPassword, newPassword)
			.then(async (result: PasswordChangeResponse) => {
				return {
					result: result.getIndex()
				};
			})
			.catch((error: unknown) => {
				console.error('Error changing email:');
				console.error(error);
				return {
					result: Enum.PasswordChangeResponse.ERROR.getIndex()
				};
			});
	}

	requiresAuthentication(): boolean {
		return true;
	}
}

export async function changePassword(
	token: string,
	oldPassword: string | null,
	newPassword: string,
	requireOld = true
): Promise<PasswordChangeResponse> {
	try {
		const decoded = verifyToken(token);

		if (requireOld) {
			const result = await runQuery<any[]>('SELECT password FROM accounts WHERE id = ?', [decoded.userId]);
			if (!(await verifyPassword(oldPassword!, result[0].password))) {
				return Enum.PasswordChangeResponse.PASSWORD_INCORRECT;
			}
		}

		const hash = await hashPassword(newPassword);
		await runQuery('UPDATE accounts SET password = ? WHERE id = ?', [hash, decoded.userId]);

		return Enum.PasswordChangeResponse.SUCCESS;
	} catch {
		return Enum.PasswordChangeResponse.ERROR;
	}
}

endpoints.push(new ChangePassword());
