//const webpack = require('webpack');
const path = require('path');
module.exports = {
	mode: 'development',
	entry: {
		app: "./src/App.jsx",
		vendor: ['react', 'react-dom', 'whatwg-fetch']
	},
	output: {
		path: path.resolve(__dirname, "./static"),
		filename: "[name].bundle.js"
	},
	
	module: {
		rules: [
			{
				test:/\.jsx$/,
				loader: "babel-loader",
				query: {
					presets: ['react', 'es2015']
				}
			},
		]
	},
};