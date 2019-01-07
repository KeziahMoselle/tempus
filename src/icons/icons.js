const path = require('path')

let extension
process.platform === 'win32'
  ? extension = 'ico' // .ico on Win32
  : extension = 'png' // .png on Darwin

module.exports = {
  idle: path.join('src', 'icons', `idle.${extension}`),
  counting: path.join('src', 'icons', `counting.${extension}`),
  pausing: path.join('src', 'icons', `pausing.${extension}`)
}
