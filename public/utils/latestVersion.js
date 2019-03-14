const got = require('got')
const { Notification, shell } = require('electron')
const { version } = require('../../package.json')

const githubReleaseUrl = 'https://api.github.com/repos/KeziahMoselle/tempus/releases/latest'

async function latestVersionAvailable () {
  try {
    const { body } = await got(githubReleaseUrl)
    const { name } = JSON.parse(body)

    if (name !== version) {
      const notification = new Notification({
        title: 'Tempus',
        body: 'Click to download the new version on the Website !'
      })
  
      notification.show()
  
      notification.on('click', () => shell.openExternal(`https://tempus.keziahmoselle.fr/?from=${name}`))
      
      return
    } else {
      return false // Same version
    }
    
  } catch (error) {
    console.error('Unable to check for latest versions.', error)
  }
}

module.exports = latestVersionAvailable