const { PacketType} = require("../client/public/packet");
const { PacketClientNameConfirm } = require("../client/public/packets/packet-client-name-confirm");
const { GameLobby, getLobby, lobbies} = require("./game-lobby");
const { NameErrorType } = require("../client/public/enums");
const e = require("express");

let globalClients = [];

class Client {
    constructor(socket) {
        this.id = socket.id;
        this.name = 'User';
        this.socket = socket;

        socket.on('disconnect', () => {
            let id = socket.id;
            globalClients = globalClients.filter((client) => client.id !== id);

            let lobby = this.getLobby();

            lobbies.forEach((lobby) => {
                lobby.clients = lobby.clients.filter((client) =>
                    client.id !== id);
            });

            if(lobby) lobby.sendUpdates();
        });


        socket.on('packet', (packet) => {
            if (!packet.type === PacketType.SERVER_BOUND) return;

            if (packet.id === 0x02) {
                let selectedName = packet.name;

                let code = 0x00
                if(packet.name.toLowerCase() === 'admin') code = NameErrorType.BAD_NAME.code;
                else if(packet.name.length < 3) code = NameErrorType.TOO_SHORT.code;
                else if(packet.name.length > 30) code = NameErrorType.TOO_LONG.code;

                let response = new PacketClientNameConfirm(selectedName, code);
                response.addClient(this);

                response.send(socket);
                this.name = packet.name;

                if(code === 0x00) {
                    this.getLobby().sendUpdates();
                }
            }
        });
    }

    getLobby() {
        return lobbies.find((lobby) => lobby.clients.includes(this));
    }
}

module.exports = { Client, globalClients };
