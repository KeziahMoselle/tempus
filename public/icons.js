const path = require('path')

let extension
process.platform === 'win32'
  ? extension = 'ico' // .ico on Win32
  : extension = 'png' // .png on Darwin

module.exports = {
  idle: path.join(__dirname, 'icons', `idle.${extension}`),
  counting: path.join(__dirname, 'icons', `counting.${extension}`),
  pausing: path.join(__dirname, 'icons', `pausing.${extension}`)
}
