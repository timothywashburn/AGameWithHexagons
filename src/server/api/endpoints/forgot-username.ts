import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../authentication";

class ForgotUsername extends Endpoint {

    getParameters(): string[] {
        return ["email"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        const email = parameters[0]
        await auth.requestUsername(email);

        return {
            success: true
        };
    }

    requiresAuthentication(): boolean {
        return false;
    }

}

endpoints.push(new ForgotUsername());