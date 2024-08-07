import {Endpoint, endpoints} from "../endpoint";
import * as auth from '../../authentication';
import {AuthData} from "../endpoint";

class Login extends Endpoint {

    getParameters(): string[] {
        return ["username", "password"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        //TODO: Implement rate limits and captcha?

        const username = parameters[0];
        const password = parameters[1];

        if(!username || !password) {
            return {
                success: false,
                result: 'Invalid username or password',
            };
        }

        return auth.attemptLogin(username, password)
        .then(async (result: boolean) => {
            return {
                success: result,
                token: result ? await auth.generateToken(username) : null,
            };
        })
        .catch((error: unknown) => {
            console.error('Error logging in:');
            console.error(error);
            return {
                success: false
            };
        });
    }

    requiresAuthentication(): boolean {
        return false;
    }

}

endpoints.push(new Login());