import React from 'react'
import ReactDOM from 'react-dom'
import { createStore , applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import axios from 'axios'
import { browserHistory } from 'react-router'

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
    browserHistory.push('/some/'+str )
    store.dispatch( { type: 'CHANGE' , value : str } )
  }
  fetch(url) {
    store.dispatch( (dispatch, getState) => {
      if (getState().isFetching) {
        return Promise.resolve();  // これは必須ではなく、便宜的なもの
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
