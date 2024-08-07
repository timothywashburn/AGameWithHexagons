import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../controllers/authentication";

class ResendVerification extends Endpoint {

    getParameters(): string[] {
        return [];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {

        await auth.sendEmailVerification(authData.token);
        return {
            success: true
        };
    }

    requiresAuthentication(): boolean {
        return true;
    }

}

endpoints.push(new ResendVerification());