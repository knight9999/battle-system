import React from 'react'
import ReactDOM from 'react-dom'

class Hello extends React.Component {
  render() {
    return (
      <h1>Hello XYZ</h1>
    )
  }
}



module.exports = {
  run: () => {
    ReactDOM.render(
      <Hello />,
      document.getElementById('hello')
    )
  }
}
