import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../authentication";
import {NameChangeResponse, NameChangeResponseData} from "../../../shared/enums";

class ChangeUsername extends Endpoint {

    getParameters(): string[] {
        return ["username"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        let username = parameters[0];

        return auth.changeUsername(authData.token, username)
        .then(async (result: NameChangeResponseData) => {
            console.log('TEST1')
            return ({
                result: result.id
            });
        })
        .catch((error: unknown) => {
            console.error('Error changing username');
            console.error(error);
            return {
                result: NameChangeResponse.ERROR.id
            };
        });
    }


    requiresAuthentication(): boolean {
        return true;
    }

}

endpoints.push(new ChangeUsername());