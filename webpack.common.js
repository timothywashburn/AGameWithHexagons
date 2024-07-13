const path = require('path');

module.exports = {
	entry: {
		play: './src/client/js/pages/play.ts',
		registration: './src/client/js/pages/registration.js',
		login: './src/client/js/pages/login.js',
		account: './src/client/js/pages/account.js',
		reset: './src/client/js/pages/reset.js',
		forgot: './src/client/js/pages/forgot.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		publicPath: '',
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: 'ts-loader'
			}
			// {
			// 	test: /\.ts$/,
			// 	exclude: /node_modules/,
			// 	use: {
			// 		loader: 'babel-loader',
			// 		options: {
			// 			presets: ['@babel/preset-typescript'],
			// 		},
			// 	},
			// },
			// {
			// 	test: /\.ejs$/,
			// 	use: 'raw-loader',
			// },
		],
	},
};
