import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../authentication";

class ForgotPassword extends Endpoint {

    getParameters(): string[] {
        return ["email"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        let email = parameters[0];
        await auth.requestPasswordReset(email);

        return {
            success: true
        };
    }

    requiresAuthentication(): boolean {
        return false;
    }

}

endpoints.push(new ForgotPassword());