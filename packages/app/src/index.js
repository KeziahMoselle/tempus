import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import { ipc } from '@tempus/core'
import isElectron from './utils/isElectron'

if (!isElectron) {
  window.ipcRenderer = ipc
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
