const url = require('url')
const path = require('path')
const { app, BrowserWindow, Tray, Menu } = require('electron')

const NODE_ENV = process.env.NODE_ENV

let tray
let trayWindow

function createWindow () {
  trayWindow = new BrowserWindow({
    width: 800,
    height: 350,
    icon: path.join('src', 'icons', 'idle.png')
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
  tray = new Tray(path.join('src', 'icons', 'idle.png'))
  tray.setToolTip('Double click to start the pomodoro.')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Start'
    },
    {
      label: 'Reset'
    },
    {
      label: 'Quit'
    }
  ])
  tray.setContextMenu(contextMenu)

  tray.on('double-click', createWindow)
}

app.on('ready', createTray)
