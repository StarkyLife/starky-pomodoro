const { merge } = require('webpack-merge');

const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    open: true,
    hot: true,
  },
  devtool: 'source-map',
});
