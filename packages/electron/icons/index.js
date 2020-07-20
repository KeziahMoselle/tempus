const path = require('path')
const { nativeImage } = require('electron')

let extension
process.platform === 'win32'
  ? (extension = 'ico') // .ico on Win32
  : (extension = 'png') // .png on Darwin

function getIcon(icon) {
  const iconPath = path.join(__dirname, `${icon}.${extension}`)
  return iconPath
}

function getStateIcon(icon) {
  const stateIconPath = path.join(__dirname, 'state', `${icon}.${extension}`)
  return stateIconPath
}

module.exports = {
  idle: getIcon('idle'),
  pausing: getIcon('pausing'),
  counting: getStateIcon('zero'),
  one: getStateIcon('one'),
  two: getStateIcon('two'),
  three: getStateIcon('three'),
  four: getStateIcon('four')
}
