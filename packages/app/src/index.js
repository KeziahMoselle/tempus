import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import IpcRenderer from './utils/IpcRenderer'
import IpcMain from './utils/IpcMain'
import isElectron from './utils/isElectron'

if (!isElectron) {
  const ipcMain = new IpcMain()

  ipcMain.on('handshake', (event, data) => {
    console.log('Handshake')

    event.emit('handshake', {
      work: 1,
      pause: 1,
      sessionStreak: 5,
      numberOfCycle: 0,
      isDraggable: false,
      workTillDelayedMinutes: 0
    })
  })

  const ipcRenderer = new IpcRenderer(ipcMain)
  window.ipcRenderer = ipcRenderer
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
