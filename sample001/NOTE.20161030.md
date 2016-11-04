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

### devDependenciesとdependenciesについて

package.jsonのdevDependenciesは開発時のみに必要なライブラリ、dependenciesには
実行時に必要なライブラリを入れる。

今回は、webpackによりすべてのコードをbundle.jsにして使っているので、実は、reactやreact-domも
devDependenciesに入れた方が良い。

逆に、webpackを使わずに、

node_modules/react/dist/react.js
node_modules/react-dom/dist/react-dom.js
node_modules/babel-core/lib/api/browser.js

を直接読み込んで実行するのであれば、全部、dependenciesの方に入れた方が良い。

例：

 node_modulesディレクトリをすべてwww配下に起き、
 次のようなコードを考える。

index.html

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Battle-System sample001</title>
<!--  <script src="js/bundle.js"></script> -->
  <script src="node_modules/react/dist/react.js"></script>
  <script src="node_modules/react-dom/dist/react-dom.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
  <script type="text/babel">

  // import React from 'react'
  // import ReactDOM from 'react-dom'
  class Hello extends React.Component {
    render() {
      return (
        <h1>Hello ABC</h1>
      )
    }
  }
  ReactDOM.render(
    <Hello />,
    document.getElementById('hello')
  )

  </script>
</head>
<body>
  This is a test program. <br />
  <div id="hello"></div>
</body>
</html>
```

これでも、上記と同様の動作を行うことがわかる。

なお、browser.min.jsは、babel6には含まれなくなってしまったので、わざわざサーバーから取得している。
ローカルにbabel5を入れておけば、そこにあるbrowser.min.jsを使って良い。


例２：

http://www.saltycrane.com/blog/2016/01/how-set-up-babel-6-with-react-mac-os-x-command-line-only/

にあるように、reactは直接読み込み、babelを使ってユーザーコードだけビルドする方法もある。

まず、

    $ install babel-cli

で、babel-cliを入れておく。

また、先と同じように、node_modules/reactやnode_modules/react-domを、www配下においておく。

コード

.babelrc

```
{
  "presets": ["react", "es2015"]
}
```

www/index.html

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Battle-System sample001</title>
  <script src="node_modules/react/dist/react.js"></script>
  <script src="node_modules/react-dom/dist/react-dom.js"></script>
  <script src="js/bundle.js"></script>
</head>
<body>
  This is a test program. <br />
  <div id="hello"></div>
  <script type="text/babel">
  import React from 'react'
  import ReactDOM from 'react-dom'

  class Hello extends React.Component {
    render() {
      return (
        <h1>Hello XYZ</h1>
      )
    }
  }

  ReactDOM.render(
    <Hello />,
    document.getElementById('hello')
  )

  </script>
</body>
</html>
```

www/main.jsx

```
class Hello extends React.Component {
  render() {
    return (
      <h1>Hello XYZ</h1>
    )
  }
}

ReactDOM.render(
  <Hello />,
  document.getElementById('hello')
)
```

コンパイル

    $ node_modules/.bin/babel www/main.jsx -o www/main.babelized.js
