const { merge } = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
  mode: 'production',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'app-bundle-sizes.html',
      openAnalyzer: false,
    }),
  ],
});
