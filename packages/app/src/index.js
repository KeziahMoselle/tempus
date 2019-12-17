import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import { ipc } from '@tempus/core'

// Override ipcRenderer
// This will be replaced by @tempus/core
window.ipcRenderer = ipc

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
