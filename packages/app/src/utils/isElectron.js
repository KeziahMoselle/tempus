function isElectron() {
  return navigator.userAgent.toLowerCase().indexOf(' electron/') > -1
}

module.exports = isElectron()
