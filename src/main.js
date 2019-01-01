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
  let windowUrl
  let localFile = require('url').format({
    protocol: 'file',
    slashes: true,
    pathname: path.join('build', 'index.html')
  })
  NODE_ENV === 'development'
    // DEVELOPMENT Load the CRA server
    ? windowUrl = 'http://localhost:3000/'
    // PRODUCTION Load the React build
    : windowUrl = localFile
  console.log(windowUrl)
  trayWindow.loadURL(windowUrl)

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
