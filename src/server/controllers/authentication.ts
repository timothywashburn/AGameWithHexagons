import ServerClient, { UserProfile } from '../objects/server-client';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../../../config.json';
import { runQuery } from './sql';

const saltRounds = 10;

export function verifyToken(token: string) {
	try {
		const decoded = jwt.verify(token, config.secret);
		if (typeof decoded === 'string') {
			throw new Error('Invalid token');
		}
		return decoded;
	} catch (error) {
		if (error instanceof JsonWebTokenError) {
			console.error('Invalid JWT');
			throw error;
		}
		console.error('Error verifying JWT:', error);
		throw error;
	}
}

export async function hashPassword(password: string) {
	return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
	return await bcrypt.compare(password, hashedPassword);
}

export async function accountExists(username: string): Promise<boolean> {
	const result = await runQuery<any[]>('SELECT * FROM accounts WHERE username = ?', [username]);
	return result.length > 0;
}

export async function generateToken(username: string, expires = '1w'): Promise<string> {
	const result = await runQuery<any[]>('SELECT id FROM accounts WHERE username = ?', [username]);
	const payload = { userId: result[0].id };
	const options = { expiresIn: expires };

	return jwt.sign(payload, config.secret, options);
}

export async function validateUser(token: string, client?: ServerClient | null): Promise<boolean> {
	const userProfile = await getUserProfile(token);
	if (!userProfile) {
		return false;
	}

	if (client) {
		client.isAuthenticated = true;
		client.profile = userProfile;
	}

	return true;
}

export async function getUserProfile(token: string): Promise<UserProfile | null> {
	try {
		const decoded = verifyToken(token);
		const result = await runQuery<any[]>('SELECT last_logout, username FROM accounts WHERE id = ?', [
			decoded.userId
		]);

		if (result.length === 0 || (decoded.iat && result[0].last_logout / 1000 > decoded.iat)) return null;

		return {
			userID: decoded.userId,
			username: result[0].username
		};
	} catch {
		return null;
	}
}

export async function getUserEmail(userID: number): Promise<string> {
	const result = await runQuery<any[]>('SELECT id FROM accounts WHERE id = ?', [userID]);
	return result[0].id;
}

export async function verifyEmail(token: string): Promise<boolean> {
	try {
		const decoded = verifyToken(token);

		const emailChange = await runQuery<any[]>('SELECT last_email_change FROM accounts WHERE id = ?', [
			decoded.userId
		]);

		if (!decoded.iat || Math.floor(emailChange[0].last_email_change / 1000) > decoded.iat) {
			return false;
		}

		await runQuery('UPDATE accounts SET email_verified = ? WHERE id = ?', [true, decoded.userId]);
		return true;
	} catch {
		return false;
	}
}

export async function getUsername(email: string): Promise<string | null> {
	const result = await runQuery<any[]>('SELECT username FROM accounts WHERE email = ?', [email]);
	if (result.length === 0) return null;
	return result[0].username;
}

export async function isUsernameTaken(username: string): Promise<boolean> {
	const result = await runQuery<any[]>('SELECT * FROM accounts WHERE username = ?', [username]);
	return result.length > 0;
}

export async function isUsernameValid(username: string): Promise<boolean> {
	return username.match('^(?=.{3,39}$)[a-zA-Z\\d]+(?:-[a-zA-Z\\d]+)*$') !== null;
}

export async function isEmailInUse(email: string): Promise<boolean> {
	const result = await runQuery<any[]>('SELECT * FROM accounts WHERE email = ?', [email]);
	if (result.length === 0) return false;
	return result[0].email_verified === 1;
}

export async function generateGuestToken(profile: UserProfile) {
	const payload = {
		userId: profile.userID,
		username: profile.username
	};

	const options = { expiresIn: '1d' };

	return jwt.sign(payload, config.secret, options);
}

export async function getGuestProfile(guestToken: string): Promise<UserProfile | null> {
	try {
		const decoded = verifyToken(guestToken);
		return {
			userID: decoded.userId,
			username: decoded.username
		};
	} catch (error) {
		return null;
	}
}
