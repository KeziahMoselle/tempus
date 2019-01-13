const Store = require('electron-store')

module.exports = new Store({
  defaults: {
    work: 1500, // 25 minutes in sec
    pause: 300 // 5 minutes in sec
  }
})

