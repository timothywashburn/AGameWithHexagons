import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../controllers/authentication";
import {PasswordChangeResponse, PasswordChangeResponseData} from "../../../shared/enums/misc-enums";

class ChangePassword extends Endpoint {

    getParameters(): string[] {
        return ["oldPassword", "newPassword"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {

        let oldPassword = parameters[0];
        let newPassword = parameters[1];

       return auth.changePassword(authData.token, oldPassword, newPassword)
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
        return true;
    }

}

endpoints.push(new ChangePassword());