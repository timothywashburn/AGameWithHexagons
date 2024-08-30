import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../controllers/authentication";
import {verifyToken} from "../../controllers/authentication";
import {runQuery} from "../../controllers/sql";

class Account extends Endpoint {

    getParameters(): string[] {
        return [];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        return getAccountInfo(authData.token)
            .then(async (result: object) => {
                return {
                    success: true,
                    info: result
                };
            })
            .catch((error: unknown) => {
                console.error('Error fetching account info:');
                console.error(error);
                return {
                    success: false
                };
            });
    }


    requiresAuthentication(): boolean {
        return true;
    }

}

export async function getAccountInfo(token: string): Promise<object> {
    try {
        const decoded = verifyToken(token);
        const result = await runQuery<any[]>('SELECT username, email, email_verified FROM accounts WHERE id = ?', [decoded.userId]);
        return result[0];
    } catch {
        return {};
    }
}

endpoints.push(new Account());