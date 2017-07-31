/* global __dirname, require, module*/

const config = {
  entry: {
    boot: __dirname + '/boot-template.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  }
};

module.exports = config;
