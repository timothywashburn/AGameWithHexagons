import { Endpoint, endpoints } from '../endpoint';
import ServerGame from '../../objects/server-game';
import { isDev } from '../../misc/utils';
import config from '../../../../config.json';
import fs from 'fs';
import * as ejs from 'ejs';
import { AuthData } from '../endpoint';
import { validateUser } from '../../controllers/authentication';

class GameData extends Endpoint {
	getParameters(): string[] {
		return [];
	}

	async call(parameters: string[], authData: AuthData): Promise<string | object> {
		return new Promise(async (resolve, reject) => {
			let responseData = {
				success: true,
				authenticated: await validateUser(authData.token),
				games: ServerGame.gameList.map((game: ServerGame) => {
					return {
						id: game.id,
						name: game.getName(),
						joinable: game.isJoinable(),
						players: game.connectionManager.clients.length,
						maxPlayers: game.connectionManager.maxPlayers,
					};
				}),
				dev: {},
				html: {},
			};

			if (isDev) responseData.dev = config.dev;

			fs.readFile(
				`${__dirname}/../../../client/views/partials/game-info.ejs`,
				'utf8',
				(err: NodeJS.ErrnoException | null, file: string) => {
					if (err) {
						console.error('Error reading file:', err);
						reject(err);
						return;
					}

					responseData.html = ejs.render(file, { data: responseData });
					resolve(responseData);
				},
			);
		});
	}

	requiresAuthentication(): boolean {
		return false;
	}
}

endpoints.push(new GameData());
