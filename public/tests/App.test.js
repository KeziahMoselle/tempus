const Application = require('spectron').Application
const electron = require('electron')
const path = require('path')


describe('Application', () => {

  const app = new Application({
    path: electron,
    args: [path.join(__dirname, '..', '..', 'public', 'app.js')]
  })

  it('should open a window', async () => {
    await app.start()
    const isVisible = await app.browserWindow.isVisible()
    isVisible.toBe(true)
  })

})