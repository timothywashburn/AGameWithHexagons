import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import * as auth from "../../controllers/authentication";
import config from "../../../../config.json";
import {sendResetEmail} from "../../controllers/mail";
import {generateToken, getUsername, isEmailInUse} from "../../controllers/authentication";

class ForgotPassword extends Endpoint {

    getParameters(): string[] {
        return ["email"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {
        let email = parameters[0];
        await requestPasswordReset(email);

        return {
            success: true
        };
    }

    requiresAuthentication(): boolean {
        return false;
    }

}

export async function requestPasswordReset(email: string) {
    if (!(await isEmailInUse(email))) return;

    try {
        const username = await getUsername(email);
        if (!username) return;

        const token = await generateToken(username, '15m');
        const link = config.host + `/reset?token=${token}`;
        await sendResetEmail(username, email, link);
    } catch (error) {
        console.error('Error while requesting password reset:', error);
    }
}

endpoints.push(new ForgotPassword());