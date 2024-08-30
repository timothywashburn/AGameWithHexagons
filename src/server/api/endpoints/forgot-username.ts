import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../controllers/authentication";
import {sendUsernameEmail} from "../../controllers/mail";
import {getUsername, isEmailInUse} from "../../controllers/authentication";

class ForgotUsername extends Endpoint {

    getParameters(): string[] {
        return ["email"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        const email = parameters[0]
        await requestUsername(email);

        return {
            success: true
        };
    }

    requiresAuthentication(): boolean {
        return false;
    }

}

export async function requestUsername(email: string) {
    if (!(await isEmailInUse(email))) return;

    try {
        const username = await getUsername(email);
        if (!username) return;

        await sendUsernameEmail(username, email);
    } catch (error) {
        console.error('Error while requesting username:', error);
    }
}

endpoints.push(new ForgotUsername());