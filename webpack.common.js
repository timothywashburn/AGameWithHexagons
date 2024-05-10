const path = require('path');

module.exports = {
	entry: {
		game: './src/client/js/game.js',
		authentication: './src/client/js/authentication.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		publicPath: '',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.ejs$/,
				use: 'raw-loader',
			},
		],
	},
};
