import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../controllers/authentication";

class Account extends Endpoint {

    getParameters(): string[] {
        return [];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        return auth.getAccountInfo(authData.token)
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

endpoints.push(new Account());