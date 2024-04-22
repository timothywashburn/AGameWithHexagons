class GameLobby {


    clients = [];

    constructor(io) {
        this.io = io;
        this.setupListeners();
    }

    addClient(client) {
        this.clients.push(client);
    }

    setupListeners() {
        this.io.on('connection', (socket) => {
            console.log('a user connected');
        });
    }
}

module.exports = GameLobby;
