import { Endpoint, endpoints } from '../endpoint';
import * as auth from '../../controllers/authentication';
import { AuthData } from '../endpoint';
import { hashPassword, isUsernameTaken, isUsernameValid } from '../../controllers/authentication';
import { runQuery } from '../../controllers/sql';
import { RegistrationResponse } from '../../../shared/enums/account/registration-response';
import Enum from '../../../shared/enums/enum';

class Register extends Endpoint {
	getParameters(): string[] {
		return ['username', 'password'];
	}

	async call(parameters: string[], authData: AuthData): Promise<string | object> {
		//TODO: Implement name restrictions

		const username = parameters[0];
		const password = parameters[1];

		if (!username || !password) {
			return {
				success: false,
				result: 'Invalid username or password'
			};
		}

		return createAccount(username, password)
			.then(async (result: RegistrationResponse) => {
				return {
					success: result === Enum.RegistrationResponse.SUCCESS,
					result: result.getIndex(),
					token: result === Enum.RegistrationResponse.SUCCESS ? await auth.generateToken(username) : null
				};
			})
			.catch((error: unknown) => {
				console.error('Error creating account:');
				console.error(error);
				return {
					success: false,
					result: error
				};
			});
	}

	requiresAuthentication(): boolean {
		return false;
	}
}

async function createAccount(username: string, password: string): Promise<RegistrationResponse> {
	if (!(await isUsernameValid(username))) return Enum.RegistrationResponse.USERNAME_INVALID;

	if (await isUsernameTaken(username)) return Enum.RegistrationResponse.USERNAME_EXISTS;

	try {
		const hash = await hashPassword(password);
		await runQuery('INSERT INTO accounts (username, password) VALUES (?, ?)', [username, hash]);
		console.log('Account created:', username);
		return Enum.RegistrationResponse.SUCCESS;
	} catch (error) {
		return Enum.RegistrationResponse.PASSWORD_INVALID;
	}
}

endpoints.push(new Register());
