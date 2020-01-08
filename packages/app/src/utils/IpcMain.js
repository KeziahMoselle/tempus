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

  removeListener(channel, listener) {
    if (typeof this.channels[channel] === 'object') {
      const idx = this.channels[channel].indexOf(listener)
      if (idx > -1) {
        this.channels[channel].splice(idx, 1)
      }
    }
  }

  once(channel, listener) {
    const remove = this.on(channel, (...args) => {
      remove()
      listener.apply(this, args)
    })
  }

  /**
   * Call functions from the IpcMain channels
   *
   * @param {*} channel
   * @param {*} data
   */
  emit(IpcRenderer, channel, data) {
    if (!this.channels[channel]) {
      return console.warn(`IpcMain: No listener on '${channel}'`)
    }

    this.channels[channel].forEach(listener =>
      listener.call(this, IpcRenderer, data)
    )
  }

  removeAllListeners(channel) {
    console.log('Remove all listeners ', channel)
  }
}

module.exports = IpcMain
