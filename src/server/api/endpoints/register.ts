import {Endpoint, endpoints} from "../endpoint";
import * as auth from '../../controllers/authentication';
import {RegistrationResponse, RegistrationResponseData} from "../../../shared/enums/misc-enums";
import {AuthData} from "../endpoint";
import {hashPassword, isUsernameTaken, isUsernameValid} from "../../controllers/authentication";
import {runQuery} from "../../controllers/sql";

class Register extends Endpoint {

    getParameters(): string[] {
        return ["username", "password"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        //TODO: Implement name restrictions

        const username = parameters[0];
        const password = parameters[1];

        if(!username || !password) {
            return {
                success: false,
                result: 'Invalid username or password',
            };
        }

        return createAccount(username, password)
        .then(async (result: RegistrationResponseData) => {
            return {
                success: result.id === 0x00,
                result: result.id,
                token: result.id === 0x00 ? await auth.generateToken(username) : null,
            };
        })
        .catch((error: unknown) => {
            console.error('Error creating account:');
            console.error(error);
            return {
                success: false,
                result: error,
            };
        });
    }

    requiresAuthentication(): boolean {
        return false;
    }
}

async function createAccount(username: string, password: string): Promise<RegistrationResponseData> {
    if (!(await isUsernameValid(username))) return RegistrationResponse.USERNAME_INVALID;

    if (await isUsernameTaken(username)) return RegistrationResponse.USERNAME_EXISTS;

    try {
        const hash = await hashPassword(password);
        await runQuery('INSERT INTO accounts (username, password) VALUES (?, ?)', [username, hash]);
        console.log('Account created:', username);
        return RegistrationResponse.SUCCESS;
    } catch (error) {
        return RegistrationResponse.PASSWORD_INVALID;
    }
}

endpoints.push(new Register());