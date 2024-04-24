const { PacketType} = require("../client/public/packet");
const { GameLobby, getLobby, lobbies} = require("./game-lobby");
let globalClients = [];

class Client {
    constructor(socket) {
        this.id = socket.id;
        this.name = 'User';

        socket.on('disconnect', () => {
            let id = socket.id;
            globalClients = globalClients.filter((client) => client.id !== id);

            lobbies.forEach((lobby) => {
                lobby.clients = lobby.clients.filter((client) => client.id !== id);
            });

        });


        socket.on('packet', (packet) => {
            if (!packet.type === PacketType.SERVER_BOUND) return;

            if (packet.id === 0x02) {
                this.name = packet.name;
            }
        });
    }



}

module.exports = { Client, globalClients };