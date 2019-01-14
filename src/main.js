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

const store = require('./store')
const icons = require('./icons/icons')

const NODE_ENV = process.env.NODE_ENV

let tray
let trayWindow


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


/**
 *
 * FUNCTIONS
 *
 */

function createWindow () {
  trayWindow = new BrowserWindow({
    width: 450,
    height: 800,
    resizable: false,
    movable: false,
    fullscreenable: false,
    icon: icons.idle,
    show: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  NODE_ENV === 'development'
    // DEVELOPMENT Load the CRA server
    ? trayWindow.loadURL('http://localhost:3000/')
    // PRODUCTION Load the React build
    : trayWindow.loadURL(url.format({
      protocol: 'file',
      slashes: true,
      pathname: path.join('build', 'index.html')
    }))

  const positioner = new Positioner(trayWindow)
  positioner.move('trayBottomCenter', tray.getBounds())

  trayWindow.on('closed', () => trayWindow = null)
}

function createTray () {
  tray = new Tray(icons.idle)
  tray.setToolTip('Double click to start the pomodoro.')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide...',
      click () {
        trayWindow.isVisible() ? trayWindow.hide() : trayWindow.show()
      },
      accelerator: 'CmdOrCtrl+O'
    },
    { type: 'separator' },
    {
      label: 'Start',
      click () {
        trayWindow.webContents.send('start')
      }
    },
    {
      label: 'Stop',
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

  tray.on('click', () => {
    trayWindow.webContents.send('start')
  })

  tray.on('double-click', () => {
    trayWindow.isVisible() ? trayWindow.hide() : trayWindow.show()
  })
}
