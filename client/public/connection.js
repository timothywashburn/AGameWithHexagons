let socket = io.connect();
socket.on('connect', () => {
    console.log(socket.id);
});

function joinGame(lobby, socket) {
    let url = new URL('/api/join');
    let params = {lobby: lobby, socketId: socket.id};
    url.search = new URLSearchParams(params).toString();

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('testing');
            console.log(data);
        });
}
