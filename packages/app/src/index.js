import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import isElectron from './utils/isElectron'
import { ipcRenderer } from './backend'

if (!isElectron) {
  window.ipcRenderer = ipcRenderer
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
