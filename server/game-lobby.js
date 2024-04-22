class GameLobby {
    constructor(io) {
        this.io = io;
        this.setupListeners();
    }

    setupListeners() {
        this.io.on('connection', (socket) => {
            console.log('a user connected');
            // You can add more event listeners here for this socket
        });
    }
}

module.exports = GameLobby;
