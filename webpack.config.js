const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', path.resolve(__dirname, './app/index.js')], // エントリポイントのjsxファイル
  output: {
    path: path.resolve(__dirname, './docs/'),
    filename: 'bundle.[chunkhash].js' // 出力するファイル
  },
  plugins: [
    new UglifyJSPlugin(),
    new CleanWebpackPlugin(['docs/bundle.*']),
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    })
  ],

  module: {
    rules: [{
      test: /\.js[x]?$/, // 拡張子がjs or jsxで
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      use: [{
        loader: 'babel-loader', // babel-loaderを使って変換する
        options: {
          presets: [
            ["babel-preset-env"],
            ["babel-preset-react"]
          ] // babelのtransform-react-jsxプラグインを使ってjsxを変換
        }
      }]
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname, './docs'),
    port: 3000,
  },
};