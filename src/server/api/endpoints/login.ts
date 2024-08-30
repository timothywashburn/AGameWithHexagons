import {Endpoint, endpoints} from "../endpoint";
import * as auth from '../../controllers/authentication';
import {AuthData} from "../endpoint";
import {accountExists, verifyPassword} from "../../controllers/authentication";
import {runQuery} from "../../controllers/sql";

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

        return attemptLogin(username, password)
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

export async function attemptLogin(username: string, password: string): Promise<boolean> {
    if (!username || !password || !(await accountExists(username))) return false;

    const result = await runQuery<any[]>('SELECT * FROM accounts WHERE username = ?', [username]);
    if (result.length === 0) return false;

    return await verifyPassword(password, result[0].password);
}

endpoints.push(new Login());