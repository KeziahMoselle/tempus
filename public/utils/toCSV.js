const { data } = require('../store')

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

const result = toCSV(data.get('data'), ['day', 'value', 'streak'])