const got = require('got')
const log = require('electron-log')
const { version: currentVersion } = require('../../../package.json')

const githubReleaseUrl =
  'https://api.github.com/repos/KeziahMoselle/tempus/releases/latest'

async function getLatestVersion() {
  try {
    const { body } = await got(githubReleaseUrl)
    const { name: latestVersion } = JSON.parse(body)

    return {
      currentVersion,
      latestVersion
    }
  } catch (error) {
    log.warn('Unable to check for latest versions.', error)
  }
}

module.exports = getLatestVersion
