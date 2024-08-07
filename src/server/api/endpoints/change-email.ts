import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../controllers/authentication";
import {EmailChangeResponse, EmailChangeResponseData} from "../../../shared/enums/misc-enums";

class ChangeEmail extends Endpoint {

    getParameters(): string[] {
      return ["email"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {

        let email = parameters[0];

        return auth.changeEmail(authData.token, email)
        .then(async (result: EmailChangeResponseData) => {
            return {
                result: result.id
            };
        })
        .catch((error: unknown) => {
            console.error('Error changing email:');
            console.error(error);
            return {
                result: EmailChangeResponse.ERROR.id
            };
        });

    }

    requiresAuthentication(): boolean {
        return true;
    }

}

endpoints.push(new ChangeEmail());