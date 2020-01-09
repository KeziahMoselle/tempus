class IpcRenderer {
  constructor(IpcMain) {
    this.channels = {}
    this.IpcMain = IpcMain
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

  send(channel, data) {
    this.IpcMain.emit(this, channel, data)
  }

  /**
   * Call functions from the IpcRenderer channels
   *
   * @param {*} channel
   * @param {*} data
   */
  async emit(channel, data) {
    await this.waitEventLoop()

    if (!this.channels[channel]) {
      return console.warn(`IpcRenderer: No listener on '${channel}'`)
    }

    this.channels[channel].forEach(listener => listener.call(this, data))
  }

  removeAllListeners(channel) {
    console.log('Remove all listeners ', channel)
  }

  waitEventLoop() {
    return Promise.resolve()
  }
}

module.exports = IpcRenderer
