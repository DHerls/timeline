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
    'main': './main/index'
  },
  module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader", // translates CSS into CommonJS
          ]
        },
        {
          test: /\.scss$/,
          use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')]
            }
          }
        }
      ]
  },
  resolve: {
    modules: ['/src/node_modules'],
    extensions: ['*', '.js', '.jsx', '.css', '.scss']
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
}

config.plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new BundleTracker({ filename: '../static/webpack-stats.dev.json' }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development'),
      BASE_URL: JSON.stringify('http://127.0.0.1:8000/'),
    }
  })
];

config.output = {
  path: path.join(__dirname, '../static/builds'),
  filename: '[name]-[hash].js',
  publicPath: 'http://127.0.0.1:8080/',
};

config.devServer = {
  inline: true,
  progress: true,
  hot: true,
  historyApiFallback: true,
  host: '0.0.0.0',
  port: 8080,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
  }
};

module.exports = config;
