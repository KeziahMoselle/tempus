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
    autoHide: false,
    showNotifications: true,
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


const localData = data.get('data')

// Create a new key at startup
if (localData.length === 0) { // If there is no key yet
  setNewKey(localData)
} else if (localData[localData.length - 1].day !== ISODate) {
  // If the last key is not the same -> avoid duplicata
  setNewKey(localData)
}

if (localData.length >= 2) {
  // Fill potential empty dates 
  fillEmptyDates(localData)
}

function setNewKey (newData) {
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

function fillEmptyDates (entries) {
  // Check for potential empty dates
  const lastEntry = entries[entries.length - 2].day
  // Yesterday because today already exists with `setNewKey()`
  const date = new Date()
  date.setDate(date.getDate() - 1)
  const [yesterday] = date.toISOString().split('T')

  // Cancel if no empty dates
  if (yesterday === lastEntry) return 

  const firstDate = entries[0].day
  const lastDate = entries[entries.length - 1].day

  const dates = [...Array(Date.parse(lastDate)/86400000 - Date.parse(firstDate)/86400000 + 1).keys()]
    .map(k => new Date(86400000*k+Date.parse(firstDate))
    .toISOString()
    .split('T')[0])

  const result = []

  for(let i=0 , j=0; i<dates.length; i++) {
    let hasSameKey = false
    if (dates[i] === entries[j].day) hasSameKey = true

    result[i] = {
      day: dates[i],
      value: hasSameKey ? entries[j].value : 0,
      streak: hasSameKey ? entries[j].streak : 0
    }

    if (hasSameKey) j++
  }

  data.set('data', result)

  // Update the last index
  const newIndex = result.length - 1 
  config.set('lastTimeUpdated.index', newIndex)
}

module.exports = {
  config,
  data,
  updateData
}
