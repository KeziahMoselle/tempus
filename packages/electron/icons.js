const path = require('path')

let extension
process.platform === 'win32'
  ? extension = 'ico' // .ico on Win32
  : extension = 'png' // .png on Darwin

console.log(getPath('icon.ico'))

function getPath(icon) {
  return path.join(__dirname, 'assets', 'icons', icon)
}

module.exports = {
  idle: getPath(`idle.${extension}`),
  pausing: getPath(`pausing.${extension}`),
  counting: getPath(`zero.${extension}`),
  one: getPath(`one.${extension}`),
  two: getPath(`two.${extension}`),
  three: getPath(`three.${extension}`),
  four: getPath(`four.${extension}`),
}
