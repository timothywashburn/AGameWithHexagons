import { Endpoint, endpoints } from '../endpoint';
import { AuthData } from '../endpoint';
import * as auth from '../../controllers/authentication';
import { validateUser } from '../../controllers/authentication';
import Enum from '../../../shared/enums/enum';

class Verify extends Endpoint {
	getParameters(): string[] {
		return ['token'];
	}

	async call(parameters: string[], authData: AuthData): Promise<string | object> {
		let token = parameters[0];

		if (await validateUser(token)) {
			return auth
				.verifyEmail(token)
				.then(async (result: boolean) => {
					return (
						'/account?toast=' +
						(result
							? Enum.AccountToastMessage.EMAIL_VERIFIED.getIndex()
							: Enum.AccountToastMessage.EMAIL_VERIFIED_ERROR.getIndex())
					);
				})
				.catch((error: unknown) => {
					console.error('Error verifying account:');
					console.error(error);
					return '/account?toast=' + Enum.AccountToastMessage.EMAIL_VERIFIED_ERROR.getIndex();
				});
		} else {
			return '/account?toast=' + Enum.AccountToastMessage.EMAIL_VERIFIED_ERROR.getIndex();
		}
	}

	requiresAuthentication(): boolean {
		return false;
	}
}

endpoints.push(new Verify());
