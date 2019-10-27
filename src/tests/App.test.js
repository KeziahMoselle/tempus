import React from 'react'
import ReactDOM from 'react-dom'
import './__mocks__/ipcRenderer'
import App from '../App'

it('renders', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})
