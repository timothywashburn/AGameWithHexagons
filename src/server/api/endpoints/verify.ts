import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../controllers/authentication";
import {ToastMessage} from "../../../shared/enums/misc-enums";
import {validateUser} from "../../controllers/authentication";

class Verify extends Endpoint {

    getParameters(): string[] {
        return ["token"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {

        let token = parameters[0];

        if(await validateUser(token)) {

            return auth.verifyEmail(token)
                .then(async (result: boolean) => {
                    return '/account?toast=' + (result ? ToastMessage.EMAIL_VERIFIED.id : ToastMessage.EMAIL_VERIFIED_ERROR.id);
                })
                .catch((error: unknown) => {
                    console.error('Error verifying account:');
                    console.error(error);
                    return '/account?toast=' + ToastMessage.EMAIL_VERIFIED_ERROR.id;
                });
        } else {
            return '/account?toast=' + ToastMessage.EMAIL_VERIFIED_ERROR.id;
        }
    }

    requiresAuthentication(): boolean {
        return false;
    }

}

endpoints.push(new Verify());