const Store = require('electron-store')

const config = new Store({
  defaults: {
    work: 1500, // 25 minutes in sec
    pause: 300 // 5 minutes in sec
  }
})

const data = new Store({
  name: 'data'
})

module.exports = {
  config,
  data
}

