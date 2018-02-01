module.exports = {
    entry: __dirname + "/src/main.js", //ビルドするファイル
    output: {
      path: __dirname +'/dist', //ビルドしたファイルを吐き出す場所
      filename: 'bundle.js',//ビルドした後のファイル名
      //publicPath:'/'
    },
      module: {
      loaders: [
              //loader
        ]
    },
    devServer: {
        contentBase:  __dirname + "/dist",
        //publicPath: __dirname + '/src',
        watchContentBase: true
     },
  };