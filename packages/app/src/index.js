import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import { Ipc } from '@tempus/core'
import isElectron from './utils/isElectron'

if (!isElectron) {
  window.ipcRenderer = new Ipc()
  console.log(window.ipcRenderer)
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
