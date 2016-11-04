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
