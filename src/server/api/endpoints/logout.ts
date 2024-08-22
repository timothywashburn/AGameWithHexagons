import {Endpoint, endpoints} from "../endpoint";
import * as auth from "../../controllers/authentication";
import {AuthData} from "../endpoint";
import {verifyToken} from "../../controllers/authentication";
import {runQuery} from "../../controllers/sql";

class Logout extends Endpoint {

    getParameters(): string[] {
        return [];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        return logout(authData.token)
        .then(async (result: boolean) => {

            return {
                success: result,
            };
        })
        .catch((error: unknown) => {
            console.error('Error logging out:');
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

export async function logout(token: string): Promise<boolean> {
    try {
        const decoded = verifyToken(token);
        await runQuery('UPDATE accounts SET last_logout = ? WHERE id = ?', [Date.now(), decoded.userId]);
        return true;
    } catch {
        return false;
    }
}

endpoints.push(new Logout());