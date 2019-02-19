const path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

config = {
  resolveLoader: {
    modules: [
      // 'node_modules',
      path.resolve(__dirname, '../src/node_modules')
    ]
  },
  mode: 'development',
  entry: {
    'main': './index.js'
  },
  module: {
      rules: [{
          test: /\.scss$/,
          use: [
              "style-loader", // creates style nodes from JS strings
              "css-loader", // translates CSS into CommonJS
              "sass-loader" // compiles Sass to CSS, using Node Sass by default
          ]
      }]
  },
  resolve: {
    modules: ['/src/node_modules'],
    extensions: ['.js', '.jsx', '.css', '.scss']
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
}

config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new BundleTracker({ filename: './webpack/webpack-stats.dev.json' }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development'),
      BASE_URL: JSON.stringify('http://0.0.0.0:8000/'),
    }
  })
];

config.output = {
  path: path.join(__dirname, './builds/'),
  filename: '[name].js',
  publicPath: 'http://127.0.0.1:8080/',
};

config.devServer = {
  inline: true,
  progress: true,
  hot: true,
  historyApiFallback: true,
  host: '0.0.0.0',
  port: 8080
};

module.exports = config;
