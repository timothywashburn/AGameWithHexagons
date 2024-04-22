function updateLobbies() {
	fetch('/api/lobbydata')
		.then(response => response.json())
		.then(data => {
			let lobbyContainer = document.getElementById('lobbyContainer');
			lobbyContainer.innerHTML = data.html;
		});
}

updateLobbies();