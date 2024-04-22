function updateLobbies() {
	fetch('/api/lobbydata')
		.then(response => response.json())
		.then(data => {
			console.log(data);
		});
}

updateLobbies();