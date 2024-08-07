import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../controllers/authentication";
import {PasswordChangeResponse, PasswordChangeResponseData} from "../../../shared/enums/misc-enums";

class ResetPassword extends Endpoint {

    getParameters(): string[] {
        return ["password"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        let password = parameters[0];

        return auth.changePassword(authData.token, null, password, false)
        .then(async (result: PasswordChangeResponseData) => {
            return {
                result: result.id
            };
        })
        .catch((error: unknown) => {
            console.error('Error changing email:');
            console.error(error);
            return {
                result: PasswordChangeResponse.ERROR.id
            };
        });
    }

    requiresAuthentication(): boolean {
        return false;
    }

}

endpoints.push(new ResetPassword());