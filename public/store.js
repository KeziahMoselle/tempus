const Store = require('electron-store')

const [ISODate] = new Date().toISOString().split('T') // "yyyy-mm-dd"

// Store configuration
const config = new Store({
  defaults: {
    work: 1500, // 25 minutes in sec
    pause: 300, // 5 minutes in sec
    numberOfCycle: 0, // Disable cycle by default
    lastTimeUpdated: false,
    autoLaunch: false,
    goals: []
  }
})

// Store streak and informations
const data = new Store({
  name: 'data',
  defaults: {
    data: []
  }
})

// Create a new key at startup

setNewKey()

function setNewKey () {
  const newData = data.get('data')
  const lastIndex = newData.length - 1

  // Return if a key with the same date already exists
  if (newData[lastIndex].day === ISODate) return 

  // Push the new item
  const index = newData.push({
    day: ISODate,
    value: 0,
    streak: 0
  })

  // Save it
  data.set('data', newData)

  // Edit config
  config.set('lastTimeUpdated', {
    ISODate,
    index: index - 1
  })
}

function updateData (timePassed) {
  const newData = data.get('data')
  const index = newData.length - 1

  // Mutate the object
  newData[index] = {
    day: ISODate,
    value: newData[index].value + timePassed,
    streak: newData[index].streak + 1
  }

  // Save it
  data.set('data', newData)
}

module.exports = {
  config,
  data,
  updateData
}
