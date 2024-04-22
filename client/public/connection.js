let socket = io.connect();
socket.on('connect', () => {
    console.log(socket.id);

    joinGame(1, socket.id);
});

function joinGame(lobby, socket) {
    let url = '/api/join';
    let params = {lobby: lobby, socketId: socket    };
    url += '?' + new URLSearchParams(params).toString();

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('testing');
            console.log(data);
        });
}
