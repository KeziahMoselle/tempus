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
const { autoUpdater } = require("electron-updater")
const Positioner = require('electron-positioner')
const isDev = require('electron-is-dev')
const AutoLaunch = require('auto-launch')

const { config, data, updateData } = require('./store')
const icons = require('./icons')

let tray
let trayWindow
let positioner
const autoLauncher = new AutoLaunch({ name: 'pomodoro' })


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
  autoUpdater.checkForUpdatesAndNotify()
})

/* Change icon on idle */

ipcMain.on('idle', () => {
  tray.setImage(icons.idle)
})

/* Change icon on counting + notification */

ipcMain.on('counting', (event, value) => {
  // Value comes from `workTillNearestHour()` in App.jsx
  // It will override the seconds from the store because we do not store these values
  tray.setImage(icons.counting)
  
  const workTime = config.get('work') / 60
  new Notification({
    title: 'Pomodoro',
    body: `You must work during ${value ? Math.round(value / 60) : workTime} minutes.`
  }).show()
})

/* Change icon on pausing + notification */

ipcMain.on('pausing', () => {
  tray.setImage(icons.pausing)
  const pauseTime = config.get('pause') / 60
  new Notification({
    title: 'Pomodoro',
    body: `You have a break of ${pauseTime} minutes.`
  }).show()
})

/* 
* When the React App is loaded
* Update the default state of the React App with the config
*/

ipcMain.on('handshake', () => {
  const index = config.get('lastTimeUpdated.index') || null
  const streak = data.get(`data.${index}.streak`) || 0

  trayWindow.webContents.send('handshake', {
    work: config.get('work'),
    pause: config.get('pause'),
    sessionStreak: streak,
    numberOfCycle: config.get('numberOfCycle')
  })
})

/* Set new values in the config */

ipcMain.on('updateConfig', (event, data) => {
  const work = config.get('work')
  const pause = config.get('pause')
  const numberOfCycle = config.get('numberOfCycle')

  if (work !== data.work) config.set('work', data.work)
  if (pause !== data.pause) config.set('pause', data.pause)
  if (numberOfCycle !== data.numberOfCycle) config.set('numberOfCycle', data.numberOfCycle)
})


/**
 *
 * STREAK
 *
 */

/* Send data for charts */

ipcMain.on('getData', () => {
  const currentDayIndex = config.get('lastTimeUpdated.index')
  const storeData = data.get('data')

  /* Calculate the total worktime */
  const minutesOfWork = storeData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.value
  }, 0)
  const totalHoursOfWork = (minutesOfWork / 60).toFixed(1)

  /* Calculate the total streak */
  const totalStreak = storeData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.streak
  }, 0)

  /* Streak */
  let todayStreak = 0 // default value
  let todayMinutes = 0 // default value
  if (storeData[currentDayIndex]) { // Get streak if it exists
    todayStreak = Math.round(storeData[currentDayIndex].streak)
    todayMinutes = Math.round(storeData[currentDayIndex].value)
  }

  trayWindow.webContents.send('getData', {
    totalHoursOfWork,
    totalStreak,
    todayStreak,
    todayMinutes
  })
})

/* Data for the Bar chart */

ipcMain.on('getBarChartData', () => {
  const payload = data.get('data')
    .slice(-7)
    .map(object => ({
      t: new Date(object.day),
      y: object.value
    }))
  trayWindow.webContents.send('getBarChartData', payload)
})

/* Data for the Heatmap chart */

ipcMain.on('getHeatmapChartData', () => {
  const payload = data.get('data').map(object => ({
    date: object.day,
    streak: object.streak
  }))

  trayWindow.webContents.send('getHeatmapChartData', payload)
})


/* Data for Goals */

ipcMain.on('addGoal', (event, { type, value }) => {
  // Edit goals config
  const goalsConfig = config.get('goals')
  goalsConfig.push({
    type,
    value
  })

  // Save
  config.set('goals', goalsConfig)

  // Refresh the app
  event.sender.send('refreshGoals')
})

ipcMain.on('removeGoal', (event, { type, value }) => {
  const goalsConfig = config.get('goals')

  // Find the index to remove
  const index = goalsConfig.findIndex(goal => {
    return goal.type === type && goal.value === value
  })

  // Not found
  if (index === -1) return

  // Remove
  goalsConfig.splice(index, 1)

  // Save
  config.set('goals', goalsConfig)

  // Refresh the app
  event.sender.send('refreshGoals')
})

ipcMain.on('getGoalsData', () => {
  const goalsCreated = config.get('goals') // [ { type: 'day', value: 60 } ]
  const localData = data.get('data')
  const types = {
    day: 1,
    week: 7,
    month: 31,
    year: 365
  }

  let payload = []

  goalsCreated.forEach(goal => {
    // Number of days to fetch
    const days = types[goal.type]
    // Fetch the x days
    const daysData = localData.slice(`-${days}`)
    // Return the total of minutes in x days
    const totalMinutes = daysData.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.value
    }, 0)
    // Compare the value of the goal and the minutes of work
    
    // If superior -> The goal is achieved
    // If inferior -> The goal is not achieved
    let isSuccess
    totalMinutes >= goal.value ? isSuccess = true : isSuccess = false

    payload.push({
      ...goal,
      currentValue: totalMinutes,
      success: isSuccess
    })
  })

  trayWindow.webContents.send('getGoalsData', payload)
})

/* Store the streak and time */

ipcMain.on('updateData', (event, timePassed) => updateData(timePassed))



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
    backgroundColor: '#000000',
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

  positioner = new Positioner(trayWindow)
  positioner.move(`${process.platform === 'win32' ? 'trayBottomCenter' : 'trayCenter'}`, tray.getBounds())

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS
    } = require('electron-devtools-installer')
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log('Added extension : ', name))
      .catch(error => console.log(error))
    trayWindow.webContents.openDevTools()
    trayWindow.on('ready-to-show', () => trayWindow.show())
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
      type: 'checkbox',
      checked: config.get('autoLaunch'),
      label: 'Enable Launch At Login',
      click (event) {
        toggleAutoLaunch(event.checked)
      }
    },
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

function toggleAutoLaunch (isEnabled) {
  isEnabled ? autoLauncher.enable() : autoLauncher.disable()
  config.set('autoLaunch', isEnabled)
}