import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../controllers/authentication";
import {NameChangeResponse, NameChangeResponseData} from "../../../shared/enums/misc-enums";
import {isUsernameTaken, isUsernameValid, verifyToken} from "../../controllers/authentication";
import {runQuery} from "../../controllers/sql";

class ChangeUsername extends Endpoint {

    getParameters(): string[] {
        return ["username"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        let username = parameters[0];

        return changeUsername(authData.token, username)
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

export async function changeUsername(token: string, newUsername: string): Promise<NameChangeResponseData> {
    if (!(await isUsernameValid(newUsername))) return NameChangeResponse.USERNAME_INVALID;
    if (await isUsernameTaken(newUsername)) return NameChangeResponse.USERNAME_EXISTS;

    try {
        const decoded = verifyToken(token);
        await runQuery('UPDATE accounts SET username = ? WHERE id = ?', [newUsername, decoded.userId]);
        return NameChangeResponse.SUCCESS;
    } catch {
        return NameChangeResponse.ERROR;
    }
}

endpoints.push(new ChangeUsername());