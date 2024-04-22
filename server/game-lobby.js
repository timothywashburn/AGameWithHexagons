let lobbies = [];

function getLobby(lobbyId) {
    return lobbies[lobbyId - 1];
}

class GameLobby {
    clients = [];

    constructor(io) {
        this.io = io;
        this.setupListeners();

        lobbies.push(this);
    }

    addClient(client) {
        this.clients.push(client);

        console.log('clients in lobby: ', this.clients);
    }

    setupListeners() {
        this.io.on('connection', (socket) => {
            console.log('a user connected');

            socket.on('disconnect', () => {
                let id = socket.id;
                this.clients = this.clients.filter(client => client !== id);
            });
        });
    }
}

module.exports = {
    GameLobby,
    getLobby
};
