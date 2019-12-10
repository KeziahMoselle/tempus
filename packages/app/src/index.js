import React from 'react'
import ReactDOM from 'react-dom'
import './assets/index.css'
import App from './App.jsx'

window.ipcRenderer = {
  on: () => {},
  send: () => {},
  once: () => {},
  removeAllListeners: () => {}
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
