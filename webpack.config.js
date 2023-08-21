"use strict";

require("babel-polyfill");

const VueLoaderPlugin = require('vue-loader/lib/plugin');

const TerserPlugin = require('terser-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var path = require('path');

var webpack = require('webpack');

var fs = require('fs');

var appBasePath = './Scripts/App/';

var jsEntries = {};

fs.readdirSync(appBasePath).forEach(function (name) {
  var indexFile = appBasePath + name + '/main.js';

  if (fs.existsSync(indexFile)) {
    jsEntries[name] = ['babel-polyfill', indexFile];
  }
});

module.exports = {
  entry: jsEntries,
  output: {
    path: path.resolve(__dirname, './Scripts/Bundle/'),
    publicPath: '/Scripts/Bundle/',
    filename: '[name].js'
  },
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.sass$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': [
              'style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
        }
      },
      {
        test: /\.js$/,
        use: [
          "thread-loader",
          'babel-loader?cacheDirectory'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  performance: {
    hints: false
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin()
  ],
  stats: {
    warnings: false
  }
};
