const path = require('path')

let extension
process.platform === 'win32'
  ? extension = 'ico' // .ico on Win32
  : extension = 'png' // .png on Darwin

module.exports = {
  idle: path.join(__dirname, 'assets', 'icons', `idle.${extension}`),
  pausing: path.join(__dirname, 'assets', 'icons', `pausing.${extension}`),
  counting: path.join(__dirname, 'assets', 'icons', 'state', `zero.${extension}`),
  one: path.join(__dirname, 'assets', 'icons', 'state', `one.${extension}`),
  two: path.join(__dirname, 'assets', 'icons', 'state', `two.${extension}`),
  three: path.join(__dirname, 'assets', 'icons', 'state', `three.${extension}`),
  four: path.join(__dirname, 'assets', 'icons', 'state', `four.${extension}`),
}
