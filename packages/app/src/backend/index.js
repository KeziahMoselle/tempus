import IpcRenderer from './IpcRenderer'
import IpcMain from './IpcMain'

const ipcMain = new IpcMain()
const ipcRenderer = new IpcRenderer(ipcMain)

ipcMain.on('handshake', event => {
  event.emit('handshake', {
    work: 60 * 25,
    pause: 60 * 5,
    sessionStreak: 5,
    numberOfCycle: 0,
    isDraggable: false,
    workTillDelayedMinutes: 0
  })
})

export { ipcMain, ipcRenderer }
