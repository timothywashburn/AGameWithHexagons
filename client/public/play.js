function updateLobbies() {
	fetch('/api/lobbydata')
		.then((response) => response.json())
		.then((data) => {
			let lobbyContainer = document.getElementById('lobbyContainer');
			lobbyContainer.innerHTML = data.html;

			const lobbyCards = document.querySelectorAll('.lobby');

			lobbyCards.forEach((card) => {
				card.addEventListener('click', function () {
					const lobbyID = card.id;
					console.log('Clicked lobby ID:', lobbyID);
				});
			});
		});
}

updateLobbies();
