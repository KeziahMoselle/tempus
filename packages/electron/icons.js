const path = require('path')

let extension
process.platform === 'win32'
  ? (extension = 'ico') // .ico on Win32
  : (extension = 'png') // .png on Darwin

function getPath(icon, state) {
  if (state) {
    return path.join(__dirname, 'assets', 'icons', 'state', icon)
  }

  return path.join(__dirname, 'assets', 'icons', icon)
}

module.exports = {
  idle: getPath(`idle.${extension}`),
  pausing: getPath(`pausing.${extension}`),
  counting: getPath(`zero.${extension}`, true),
  one: getPath(`one.${extension}`, true),
  two: getPath(`two.${extension}`, true),
  three: getPath(`three.${extension}`, true),
  four: getPath(`four.${extension}`, true)
}
