## 2016/11/05

# React, ReactDOMをどこに入れるか？

js側でimport文を使って、React, ReactDOMを入れてしまう場合は、
結局、全部バンドルされるので、devDependenciesで良い。

逆に、script文でReact, ReactDOMを入れて使う場合は、
dependenciesに入れれば良い。


# staticについて

ES2015とreactだけだと、staticなフィールドは使えない。そのため

```
class Hello extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired
  }
  ...
}
```

はエラーになってしまう。

```
class Hello extends React.Component {
  propTypes : {
    value: PropTypes.string.isRequired
  }
  ...
}
```

とする。


# Redux化して、ボタンクリックに対応したサンプルコード

```
$ npm install --save redux
```


```
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'

var counter = (state = "HELLO", action) => {
  switch (action.type) {
    case 'CHANGE':
      return action.value
    default:
      return state
  }
}

const store = createStore(counter)

class Hello extends React.Component {
  propTypes : {
    value: PropTypes.string.isRequired
  }
  change(str) {
    store.dispatch( { type: 'CHANGE' , value : str } )
  }
  render() {
    return (
      <div>
        <h1>Hello {this.props.value}</h1>
        <p>
          <button onClick={() => this.change('GoodMorning')}>GoodMorning</button>
        </p>
        <p>
          <button onClick={() => this.change('GoodBye')}>GoodBye</button>
        </p>
      </div>
    )
  }
}

const render = () => {
  ReactDOM.render(
    <Hello value={store.getState()} />,
    document.getElementById('hello')
  )
}

module.exports = {
  run: render
}

store.subscribe(render)
```


# さらに、Ajax化してみる。

参考サイト：
http://qiita.com/halhide/items/a45c7a1d5f949596e17d

combineReducersについて
http://qiita.com/kuy/items/59c6d7029a10972cba78



action
FETCHとRECEIVEをそれぞれ用意する。


```
npm install --save redux-thunk
```

```
npm install --save axios
```

本体コードは

```
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore , applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import axios from 'axios'

var counter = (state = { value : "HELLO" , isFetching: false } , action) => {
  switch (action.type) {
    case 'CHANGE':
      return { value : action.value , isFetching : false }
    case 'FETCH':
      return { value : state.value , isFetching : false }
      // return assign( {} , state , { isFetching : true }
    case 'RECEIVE':
      return { value : action.value , isFetching: false }
    default:
      return state
  }
}

class Hello extends React.Component {
  propTypes : {
    value: PropTypes.string.isRequired
  }
  change(str) {
    store.dispatch( { type: 'CHANGE' , value : str } )
  }
  fetch(url) {
    store.dispatch( (dispatch, getState) => {
      if (getState().isFetching) {
        return Promise.resolve();
      } else {
        return dispatch(
          (dispatch) => {
            dispatch( { type : "FETCH" } );
            return axios.get(url).then(
              response => {
//                alert( JSON.stringify( response ) )

                dispatch( { type : "RECEIVE" , value : response.data.message } )
              }
            )
          }
        )
      }
    })
  }
  render() {
    return (
      <div>
        <h1>Hello {this.props.value}</h1>
        <p>
          <button onClick={ () => this.change('GoodMorning')}>GoodMorning</button>
        </p>
        <p>
          <button onClick={ () => this.change('GoodBye')}>GoodBye</button>
        </p>
        <p>
          <button onClick={ () => this.fetch('/fetch/data1.json') }>Fetch 1</button>
        </p>
        <p>
          <button onClick={ () => this.fetch('/fetch/data2.json')
          }>Fetch 2</button>
        </p>
      </div>
    )
  }
}

// const store = createStore(counter)

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore)

const store = createStoreWithMiddleware(counter)


const render = () => {
  ReactDOM.render(
    <Hello value={store.getState().value} />,
    document.getElementById('hello')
  )
}

module.exports = {
  run: render
}

store.subscribe(render)
```

となる。

createStoreWithMiddleware
を使うことで、thunkMiddleware付きのstoreが出来る。
これは、dispatch時に、action以外にfunctionを返すことが出来る。

functionの中で、さまざまな動作を行うことが出来る。

https://github.com/gaearon/redux-thunk

ReducerとStoreの関係など

http://qiita.com/kobanyan/items/5709fabcceb71a086507

つまり、Storeは、ReducerとActionを統合したもの

    アプリケーションのステートを保持する
    getState() を通じてステートにアクセスできるようにさせる
    dispatch(action) を通じてステートを更新できるようにさせる
    subscribe(listener) を通じてリスナーを登録させる


Reducerとは？

http://qiita.com/yasuhiro-okada-aktsk/items/9d9025cb58ffba35f864

つまり、現在のstateとActionから、新しいstateを生成するもの


## 発展URLの偽装

react-routerを使えばOK

```
import { browserHistory } from './react-router'
browserHistory.push('/some/path')
```

参考サイト：
http://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
のBobbyさんの回答

## browserHistoryじゃなく、pushを使う方法もある

http://qiita.com/kuniken/items/b8777c8342fe1b4ff727

```
contextTypes : {
  router : React.PropTypes.object.isRequired
}
```
を使える？

v1からv2への移行ガイド
http://qiita.com/kuniken/items/b8777c8342fe1b4ff727

サンプルコード
https://github.com/kunitak/react-router-1to2/blob/v2/client/scripts/index.js

本家
https://github.com/ReactTraining/react-router

上記とは別に

react-router-reduxというのものある。


## おまけ

http://qiita.com/kuniken/items/b8777c8342fe1b4ff727

にあるように、contextで値を受け渡しすることもできる。
