const fs = require('fs').promises
const path = require('path')
const { app, dialog, shell } = require('electron')
const log = require('electron-log')
const { data } = require('../store')

const downloadPath = path.join(app.getPath('downloads'), 'tempus.csv')

function exportAsCsv () {
  const csvData = toCSV(data.get('data'), ['day', 'value', 'streak'])

  fs.writeFile(downloadPath, csvData)
    .then(() => {
      const action = dialog.showMessageBox({
        type: 'info',
        message: `Exported at ${downloadPath}`,
        buttons: ['Open Directory', 'Ok']
      })
      if (action === 0) {
        shell.openExternal(app.getPath('downloads'))
      }
    })
    .catch(error => {
      const action = dialog.showMessageBox({
        type: 'error',
        message: `${error}`,
        buttons: ['Open an issue', 'Ok']
      })
      if (action === 0) {
        const url = new URL(`https://github.com/KeziahMoselle/tempus/issues/new?body=${error}`).toString()
        shell.openExternal(url)
      }
      log.warn(error)
    })
}


  function toCSV (arr, columns) {
    return [
      columns.join(','),
      ...arr.map(obj =>
        columns.reduce(
          (acc, key) => `${acc}${!acc.length ? '' : ','}"${!obj[key] ? '0' : obj[key]}"`,
          ''
        )
      )
    ].join('\n')
  }

  module.exports = exportAsCsv