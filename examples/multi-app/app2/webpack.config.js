/* global __dirname, require, module*/

const webpack = require('webpack');
const path = require('path');
const DynamicWebpackPlugin = require('./../../../lib/dynamic-public-path');

let plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common'
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'common',
    children: true
  }),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['manifest'],
    minChunks: 2
  }),
  new DynamicWebpackPlugin({
    outputPath: './dist',
    bootfilename: 'bootstrap.js',
    global: 'MyLibrary',
    publicPath: 'window.publicPath'
  })
];

const config = {
  entry: {
    library: __dirname + '/my-library.js'
  },
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    chunkFilename: '[id].[chunkhash].js',
    library: ['__library'],
    libraryTarget: 'umd'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    noInfo: false,
    inline: false,
    stats: { colors: true },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true,
    port: 9000
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  plugins: plugins
};

module.exports = config;
