class IpcMain {
  constructor() {
    this.channels = {}
  }

  on(channel, listener) {
    if (typeof this.channels[channel] !== 'object') {
      this.channels[channel] = []
    }
    this.channels[channel].push(listener)
    return () => this.removeListener(channel, listener)
  }

  /**
   * Call functions from the IpcMain channels
   *
   * @param {*} channel
   * @param {*} data
   */
  emit(sender, channel, data) {
    if (!this.channels[channel]) {
      return console.warn(`IpcMain: No listener on '${channel}'`)
    }

    this.channels[channel].forEach(listener =>
      listener.call(this, sender, data)
    )
  }
}

module.exports = IpcMain
