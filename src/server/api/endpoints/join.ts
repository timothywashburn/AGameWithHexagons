import {Endpoint, endpoints} from "../endpoint";
import ServerClient from "../../objects/server-client";
import ServerGame from "../../objects/server-game";
import {AuthData} from "../endpoint";
import * as auth from "../../controllers/authentication";

class Join extends Endpoint {

    getParameters(): string[] {
        return ['gameID', 'socketID'];
    }

    async call(parameters: string[], authData: AuthData): Promise<string | object> {

        const gameID = parseInt(parameters[0]);
        const socketID = parameters[1];

        let client = ServerClient.clientList.find((client: ServerClient) => client.socket.id === socketID);
        if (!client) {
            return {
                success: false,
                alert: false,
                message: "Could not find your client"
            };
        }

        await auth.validateUser(authData.token, client);

        let game = ServerGame.getGame(gameID);
        if (!game) {
            return {
                success: false,
                alert: false,
                message: "This is not a valid game"
            };
        } else if (game.clientManager.clients.find((testClient: ServerClient) => testClient.getID() === client!.getID())) {
            return {
                success: false,
                alert: true,
                message: "You are already in this game"
            };
        } else if (game.clientManager.clients.length >= game.clientManager.maxPlayers) {
            return {
                success: false,
                alert: true,
                message: "This game is already full"
            };
        }

        return game.clientManager.connectClient(client)
            .then(e => {
                return {
                    success: true
                };
            })
            .catch((error: unknown) => {
                console.error('Error joining game');
                console.error(error);
                return {
                    success: false,
                    result: error,
                };
            });
    }

    requiresAuthentication(): boolean {
        return false;
    }

}

endpoints.push(new Join());
