## 2016/10/30

### webpack-dev-serverの導入

```
$ npm install --save-dev webpack-dev-server
```

そして、package.jsonに

```
"scripts": {
  "start" : "webpack-dev-server"
}
```

を追加する。

また、webpack.config.jsのmodule.exportsの下に以下を追加。

```
devServer: {
  contentBase: "./www",
  port: 3000,
  inline: true,
},
```

(HotModuleReplacementPluginを使うには、npmでwebpack-hot-middlewareとか
を入れる必要がある。多分)

また、outputにも以下を追加

```
publicPath: 'http://localhost:3000/js/',
```

全体で、package.jsonとwebpack.config.jsはそれぞれ、次の通り

```
{
  "name": "sample001",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start" : "webpack-dev-server",
    "build" : "webpack"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "babel-core": "^6.18.0",
    "babel-loader": "^6.2.7",
    "babel-preset-es2015": "^6.18.0",
    "babel-preset-react": "^6.16.0",
    "webpack": "^1.13.3",
    "webpack-dev-server": "^1.16.2"
  },
  "dependencies": {
    "react": "^15.3.2",
    "react-dom": "^15.3.2"
  }
}
```

```
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/js/main.jsx',
  output: {
    path: __dirname + "/www/js",
    publicPath: 'http://localhost:3000/js/',
    filename: 'bundle.js' ,
    libraryTarget: 'var',
    library : 'EntryPoint' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015','react']
        }
      }
    ]
  },
  devServer: {
    contentBase: "./www",
    port: 3000,
    inline: true,
  },
}
```

ビルド
```
$ npm build
```

デバッグ
```
$ npm start
```

### 余談

また、HotModuleReplacementをするには、次のようなものが必要?

```
devServer: {
  contentBase: "./www",
  port: 3000,
  hot: true,
  inline: true,
},
plugins: [
  new webpack.HotModuleReplacementPlugin(),
],
```

よくわからないが、次がわかりやすそう
http://qiita.com/sergeant-wizard/items/60b557fc1c763f0a1531
