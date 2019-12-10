const { Notification, shell } = require('electron')

const getLatestVersion = require('./getLatestVersion')

async function latestVersionAvailable () {
  const { latestVersion, currentVersion } = await getLatestVersion()

  if (latestVersion !== currentVersion) {
    const notification = new Notification({
      title: 'Tempus',
      body: 'Click to download the new version on the Website !'
    })

    notification.show()

    notification.on('click', () => shell.openExternal(`https://tempus.keziahmoselle.fr/?from=${currentVersion}`))
  }

  return {
    currentVersion,
    latestVersion
  }
}

module.exports = latestVersionAvailable