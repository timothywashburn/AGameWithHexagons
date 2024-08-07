import {Endpoint, endpoints} from "../endpoint";
import * as auth from '../../authentication';
import {RegistrationResponseData} from "../../../shared/enums";
import {AuthData} from "../endpoint";

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

        return auth.createAccount(username, password)
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

endpoints.push(new Register());