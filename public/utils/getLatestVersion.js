const got = require('got')
const log = require('electron-log')
const { config } = require('../store')
const { version: currentVersion } = require('../../package.json')

const githubReleaseUrl = 'https://api.github.com/repos/KeziahMoselle/tempus/releases/latest'

async function getLatestVersion () {
  try {
    const { body } = await got(githubReleaseUrl)
    const { name: latestVersion } = JSON.parse(body)

    config.set('version', {
      current: currentVersion,
      latest: latestVersion
    })

    return latestVersion
  } catch (error) {
    log.warn('Unable to check for latest versions.', error)
  }
}

module.exports = getLatestVersion