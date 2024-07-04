const path = require('path');

module.exports = {
	entry: {
		play: './src/client/js/pages/play.js',
		registration: './src/client/js/pages/registration.js',
		login: './src/client/js/pages/login.js',
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
