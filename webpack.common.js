import path from 'path';

export default {
	entry: {
		play: './src/client/js/pages/play.ts',
		registration: './src/client/js/pages/registration.ts',
		login: './src/client/js/pages/login.ts',
		account: './src/client/js/pages/account.ts',
		reset: './src/client/js/pages/reset.ts',
		forgot: './src/client/js/pages/forgot.ts',
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
	resolve: {
		extensions: ['.ts', '.js'],
	},
};
