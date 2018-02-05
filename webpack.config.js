const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/main.js'), //ビルドするファイル
  output: {
    path: path.resolve(__dirname, './dist'), //ビルドしたファイルを吐き出す場所
    filename: 'bundle.js',//ビルドした後のファイル名
    publicPath: '/dist'
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      { 
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src'),
    inline: true,
    open: true
  },
  devtool: 'source-map',
  plugins: [
  
  ]
};