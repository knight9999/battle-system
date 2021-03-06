var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/js/main.jsx',
  output: {
    path: __dirname + "/www/js",
    publicPath: 'http://localhost:3000/js/',
    filename: 'bundle.js' ,
    libraryTarget: 'var',
    library : 'EntryPoint' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015','react']
        }
      }
    ]
  },
  devServer: {
    contentBase: "./www",
    port: 3000,
    inline: true,
  },
}
