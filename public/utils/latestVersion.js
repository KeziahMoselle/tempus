const got = require('got')
const { version } = require('../../package.json')

const githubReleaseUrl = 'https://api.github.com/repos/KeziahMoselle/tempus/releases/latest'

async function latestVersionAvailable () {
  try {
    const { body } = await got(githubReleaseUrl)
    const { name } = JSON.parse(body)

    if (name !== version) {
      return true // New version is available
    } else {
      return false // Same version
    }
    
  } catch (error) {
    console.error('Unable to check for latest versions.', error)
  }
}

module.exports = latestVersionAvailable