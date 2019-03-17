const { Notification, shell } = require('electron')
const { version: currentVersion } = require('../../package.json')

const getLatestVersion = require('./getLatestVersion')

async function latestVersionAvailable () {
    const latestVersion = await getLatestVersion()

    if (latestVersion !== currentVersion) {
      const notification = new Notification({
        title: 'Tempus',
        body: 'Click to download the new version on the Website !'
      })
  
      notification.show()
  
      notification.on('click', () => shell.openExternal(`https://tempus.keziahmoselle.fr/?from=${currentVersion}`))
  }
}

module.exports = latestVersionAvailable