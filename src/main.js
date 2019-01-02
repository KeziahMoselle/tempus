const url = require('url')
const path = require('path')
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')

const icons = require('./icons/icons')

const NODE_ENV = process.env.NODE_ENV

let tray
let trayWindow

function createWindow () {
  trayWindow = new BrowserWindow({
    width: 800,
    height: 350,
    icon: icons.idle,
    show: false,
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

  trayWindow.on('closed', () => trayWindow = null)
}

function createTray () {
  tray = new Tray(icons.idle)
  tray.setToolTip('Double click to start the pomodoro.')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Start',
      click () {
        if (!trayWindow.isVisible()) trayWindow.show()
        trayWindow.webContents.send('start')
      }
    },
    {
      label: 'Reset',
      click () {
        if (!trayWindow.isVisible()) trayWindow.show()
        trayWindow.webContents.send('reset')
      }
    },
    {
      label: 'Quit',
      click () {
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    if (trayWindow.isVisible()) {
      trayWindow.hide()
    } else {
      trayWindow.show()
    }
  })
}

function start () {
  createWindow()
  createTray()
}

app.on('ready', start)

ipcMain.on('idle', () => {
  tray.setImage(icons.idle)
})

ipcMain.on('counting', () => {
  tray.setImage(icons.counting)
})

ipcMain.on('pausing', () => {
  tray.setImage(icons.pausing)
})
