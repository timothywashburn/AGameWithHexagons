import {Endpoint, endpoints} from "../endpoint";
import * as auth from "../../authentication";
import {AuthData} from "../endpoint";

class Logout extends Endpoint {

    getParameters(): string[] {
        return [];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        return auth.logout(authData.token)
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

endpoints.push(new Logout());