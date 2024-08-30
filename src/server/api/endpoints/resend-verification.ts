import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import {sendEmailVerification} from "./change-email";

class ResendVerification extends Endpoint {

    getParameters(): string[] {
        return [];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {

        await sendEmailVerification(authData.token);
        return {
            success: true
        };
    }

    requiresAuthentication(): boolean {
        return true;
    }

}

endpoints.push(new ResendVerification());