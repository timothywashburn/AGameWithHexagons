import { Endpoint, endpoints } from '../endpoint';
import { AuthData } from '../endpoint';
import { changePassword } from './change-password';
import { PasswordChangeResponse } from '../../../shared/enums/account/password-change-response';
import Enum from '../../../shared/enums/enum';

class ResetPassword extends Endpoint {
	getParameters(): string[] {
		return ['password'];
	}

	async call(parameters: string[], authData: AuthData): Promise<string | object> {
		let password = parameters[0];

		return changePassword(authData.token, null, password, false)
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
		return false;
	}
}

endpoints.push(new ResetPassword());
