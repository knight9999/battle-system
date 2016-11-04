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
