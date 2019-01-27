const Store = require('electron-store')

// Store configuration
const config = new Store({
  defaults: {
    work: 1500, // 25 minutes in sec
    pause: 300, // 5 minutes in sec
    numberOfCycle: 0, // Disable cycle by default
    alreadySetToday: false
  }
})

const [ISODate] = new Date().toISOString().split('T') // "yyyy-mm-dd"
if (ISODate !== config.get('alreadySetToday.ISODate')) {
  // If it's a new day, set `alreadySetToday` to false
  // to create a new key when a streak is done
  config.set('alreadySetToday', false)
}

// Store streak and informations
const data = new Store({
  name: 'data',
  defaults: {
    data: []
  }
})

module.exports = {
  config,
  data
}
