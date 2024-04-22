module.exports = {
	lobbydata(req, res) {
		console.log('lobby data requested')
		res.json({
			success: true
		});
	}
}