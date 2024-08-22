import {Endpoint, endpoints} from "../endpoint";
import {AuthData} from "../endpoint";
import {EmailChangeResponse, EmailChangeResponseData} from "../../../shared/enums/misc-enums";
import validator from "email-validator";
import {
    generateToken,
    getUserEmail,
    getUsername,
    isEmailInUse,
    verifyToken
} from "../../controllers/authentication";
import config from "../../../../config.json";
import {sendVerificationEmail} from "../../controllers/mail";
import {runQuery} from "../../controllers/sql";

class ChangeEmail extends Endpoint {

    getParameters(): string[] {
      return ["email"];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {

        let email = parameters[0];

        return changeEmail(authData.token, email)
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

export async function changeEmail(token: string, newEmail: string): Promise<EmailChangeResponseData> {
    if (!validator.validate(newEmail)) return EmailChangeResponse.EMAIL_INVALID;
    if (await isEmailInUse(newEmail)) return EmailChangeResponse.EMAIL_EXISTS;

    try {
        const decoded = verifyToken(token);
        await runQuery('UPDATE accounts SET email = ? WHERE id = ?', [newEmail, decoded.userId]);
        await runQuery('UPDATE accounts SET last_email_change = ? WHERE id = ?', [Date.now(), decoded.userId]);
        await sendEmailVerification(token);
        return EmailChangeResponse.SUCCESS;
    } catch {
        return EmailChangeResponse.ERROR;
    }
}

export async function sendEmailVerification(token: string) {
    try {
        const decoded = verifyToken(token);
        const email = await getUserEmail(decoded.userId);
        await runQuery('UPDATE accounts SET email_verified = ? WHERE id = ?', [false, decoded.userId]);

        const username = await getUsername(email);
        if (!username) return;

        const generatedToken = await generateToken(username, '24h');
        const link = config.host + `/api/verify?token=${generatedToken}`;
        await sendVerificationEmail(username, email, link);
    } catch (error) {
        console.error('Error while sending email verification:', error);
    }
}

endpoints.push(new ChangeEmail());