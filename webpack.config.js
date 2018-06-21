/* devtool: 'source-map'; */
// const webpack = require('webpack');

const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: './client/Client.jsx',
    vendor: ['react', 'react-dom', 'whatwg-fetch', 'react-router', 'react-bootstrap', 'react-router-bootstrap'],
  },
  output: {
    path: path.resolve(__dirname, './static'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
    ],
  },
  devServer: {
    port: 8000,
    contentBase: 'static',
    proxy: {
      '**': {
        target: 'http://localhost:3000',
      },
    },
    historyApiFallback: true,
  },
  devtool: 'source-map',
};
