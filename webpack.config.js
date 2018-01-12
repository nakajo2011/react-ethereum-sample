const path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './app/index.js'), // エントリポイントのjsxファイル
  output: {
    path: path.resolve(__dirname, './app/'),
    filename: 'bundle.js' // 出力するファイル
  },
  plugins: [
    // new UglifyJSPlugin()
  ],

  module: {
    loaders: [{
      loader: 'babel-loader', // babel-loaderを使って変換する
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      test: /\.js[x]?$/, // 拡張子がjs or jsxで
      query: {
        cacheDirectory: false,
        plugins: [
          "babel-plugin-transform-react-jsx"
        ] // babelのtransform-react-jsxプラグインを使ってjsxを変換
      }
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname, './app'),
    port: 3000,
  },
};