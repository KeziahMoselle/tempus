/**
 *
 * MODULES
 *
 */

const url = require('url')
const path = require('path')

const { 
  BrowserWindow,
  Menu,
  Notification,
  Tray,
  app,
  ipcMain,
  shell
 } = require('electron')
const Positioner = require('electron-positioner')
const isDev = require('electron-is-dev')

const store = require('./store')
const icons = require('./icons')

let tray
let trayWindow


/* Temporary fix for Windows 10 notification in dev mode
 * Doesn't work in production  (https://github.com/electron/electron/issues/10864)
 */

if (isDev) {
  app.setAppUserModelId('com.electron.pomodoro')
}

/* Create the application */

app.on('ready', () => {
  createTray()
  createWindow()
})

/* Change icon on idle */

ipcMain.on('idle', () => {
  tray.setImage(icons.idle)
})

/* Change icon on counting + notification */

ipcMain.on('counting', () => {
  tray.setImage(icons.counting)
  const workTime = store.get('work') / 60
  new Notification({
    title: 'Pomodoro',
    body: `You must work during ${workTime} minutes.`
  }).show()
})

/* Change icon on pausing + notification */

ipcMain.on('pausing', () => {
  tray.setImage(icons.pausing)
  const pauseTime = store.get('pause') / 60
  new Notification({
    title: 'Pomodoro',
    body: `You have a break of ${pauseTime} minutes.`
  }).show()
})

/* 
* When the React App is loaded
* Update the default state of the React App with the store
*/

ipcMain.on('handshake', () => {
  trayWindow.webContents.send('updateValues', {
    work: store.get('work'),
    pause: store.get('pause')
  })
})

/* Set new values in the store */

ipcMain.on('updateStore', (event, data) => {
  store.set('work', data.work)
  store.set('pause', data.pause)
})


/* STREAK */

ipcMain.on('updateStreak', (event, data) => {
  // TODO
})


/* Window events */

ipcMain.on('win-minimize', () => trayWindow.hide())

ipcMain.on('win-close', () => app.quit())

/**
 *
 * FUNCTIONS
 *
 */

function createWindow () {
  trayWindow = new BrowserWindow({
    width: 400,
    height: 550,
    resizable: false,
    movable: false,
    fullscreenable: false,
    alwaysOnTop: true,
    icon: icons.idle,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  if (isDev) {
    // DEVELOPMENT Load the CRA server
    trayWindow.loadURL('http://localhost:3000/')
  } else {
    // PRODUCTION Load the React build
    trayWindow.loadURL(url.format({
      protocol: 'file',
      slashes: true,
      pathname: path.join(__dirname, 'index.html')
    }))
  }

  const positioner = new Positioner(trayWindow)
  positioner.move(`${process.platform === 'win32' ? 'trayBottomCenter' : 'trayCenter'}`, tray.getBounds())

  if (isDev) {
    trayWindow.webContents.openDevTools()
    trayWindow.show()
  }
}

function createTray () {
  tray = new Tray(icons.idle)
  tray.setToolTip('Pomodoro')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide...',
      click () {
        toggleWindow()
      },
      accelerator: 'CmdOrCtrl+O'
    },
    { type: 'separator' },
    {
      label: '▶ Start',
      click () {
        trayWindow.webContents.send('start')
      }
    },
    {
      label: '■ Stop',
      click () {
        trayWindow.webContents.send('stop')
      }
    },
    { type: 'separator' },
    {
      label: 'Feedback && Support...',
      click () {
        shell.openExternal('https://github.com/KeziahMoselle/pomodoro/issues/new')
      }
    },
    {
      label: 'Quit',
      click () {
        app.quit()
      },
      accelerator: 'CmdOrCtrl+Q'
    }
  ])
  tray.setContextMenu(contextMenu)

  tray.on('click', () => toggleWindow())
  tray.on('right-click', () => tray.popUpContextMenu())
}


function toggleWindow () {
  if (trayWindow.isVisible()) {
    trayWindow.hide()
  } else {
    trayWindow.show()
  }
}
