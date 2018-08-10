const webpack = require('webpack');

module.exports = {
  entry: {
    app: './client/Client.jsx',
    vendor: [
      'react', 'react-dom', 'react-router', 'react-bootstrap', 'react-router-bootstrap',
      'isomorphic-fetch', 'babel-polyfill',
    ],
  },
  output: {
    path: './static',
    filename: 'app.bundle.js',
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
  ],
  module: {
    loaders: [
      {
        test:/\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },

    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
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
