import React, { Component } from 'react'
import Counter from './components/Counter'
import Controls from './components/Controls'
import Welcome from './components/Welcome/index'

class App extends Component {
  state = {
    state: '', // Can be '', 'counting' or 'pausing'
    total: 1500, // Total of seconds for the counting interval
    count: 0, // Count the seconds to `total`
    totalPause: 300, // Total of seconds for the pausing interval
    countPause: 0, // Count the seconds for `totalPause`
    numberOfCycle: 0, // Repeat the counter `x` times (0 mean infinity)
    countCycle: 0, // Count the number of repetition
    sessionStreak: 0, // Count the streak this session
    loadedConfig: false, // Is the config has been fetched
    nextHour: null,
    workTillDelayedMinutes: 0, // Delayed minutes for 'Work till' (Allow working until 1.)
    shouldResetValues: {
      // Used for `workTillNearestHour()`
      shouldReset: false, // Should we revert the old values ?
      oldTotal: null, // Old value for total seconds
      oldCycle: null // Old value for cycle
    },
    finishedWelcome: false,
    allowDrag: false
  }

  componentDidMount() {
    if (localStorage.getItem('finishedWelcome')) {
      this.setState({
        finishedWelcome: true
      })
    }

    // Listeners from the Tray menu
    window.ipcRenderer.on('start', () => {
      if (this.state.state === '') {
        this.start()
      } else {
        this.stop()
      }
    })

    window.ipcRenderer.on('stop', () => {
      if (this.state.state) {
        this.stop()
      }
    })
    // Send `handshake` event to receive new value from the store
    window.ipcRenderer.send('handshake')
    // Receive new values from the store
    window.ipcRenderer.once('handshake', (event, data) => {
      this.setState({
        total: data.work,
        totalPause: data.pause,
        sessionStreak: data.sessionStreak,
        numberOfCycle: data.numberOfCycle,
        loadedConfig: true,
        allowDrag: data.isDraggable,
        workTillDelayedMinutes: data.workTillDelayedMinutes
      })

      // Interval to update `this.state.nextHour`
      this.updateNextHour(data.workTillDelayedMinutes)
    })
  }

  /**
   * Launch the counter
   * Creates the `countInterval` variable
   * Send `counting` event to the main process
   */
  start = displayWorkNotification => {
    if (this.state.state === 'counting') return // If already counting return
    this.countInterval = setInterval(this.increment, 1000)
    this.setState({
      state: 'counting'
    })

    // Update icon at 25%
    this.timeout25 = setTimeout(() => {
      window.ipcRenderer.send('updateTrayIcon', 'one')
    }, this.state.total * 0.25 * 1000)

    // Update icon at 50%
    this.timeout50 = setTimeout(() => {
      window.ipcRenderer.send('updateTrayIcon', 'two')
    }, this.state.total * 0.5 * 1000)

    // Update icon at 75%
    this.timeout75 = setTimeout(() => {
      window.ipcRenderer.send('updateTrayIcon', 'three')
    }, this.state.total * 0.75 * 1000)

    // Update icon at 90%
    this.timeout90 = setTimeout(() => {
      window.ipcRenderer.send('updateTrayIcon', 'four')
    }, this.state.total * 0.9 * 1000)

    window.ipcRenderer.send('counting', displayWorkNotification)
  }

  /**
   * Triggered every 1s when `state.state` = counting
   * Increment the `state.count`
   * Create the `pauseInterval` when `state.count` > `state.total`
   */
  increment = () => {
    if (this.state.count >= this.state.total) {
      // The work interval is finished
      this.stop()
      this.setState(prevState => ({
        state: 'pausing',
        sessionStreak: prevState.sessionStreak + 1,
        countCycle: prevState.countCycle + 1
      }))

      /* Cycles */
      // The maximum number of cycle has been reached
      if (
        this.state.numberOfCycle > 0 &&
        this.state.countCycle >= this.state.numberOfCycle
      ) {
        this.setState({
          countCycle: 0
        })

        // Get the old values back
        if (this.state.shouldResetValues.shouldReset) {
          this.revertValues()
        }

        // Display the notification 'You finished the pomodoro'
        window.ipcRenderer.send('finished')
        window.ipcRenderer.send('updateData', this.state.total / 60)

        new Audio('./assets/audio/notification-long.wav').play()

        return this.stop()
      }

      new Audio('./assets/audio/notification.wav').play()

      /* Streak */
      window.ipcRenderer.send('updateData', this.state.total / 60)
      /* Set pause state */
      window.ipcRenderer.send('pausing')
      /* Begin to count pause */
      return (this.pauseInterval = setInterval(this.incrementPause, 1000))
    }

    // Continue to increment the count variable
    this.setState(prevState => ({
      count: prevState.count + 1
    }))
  }

  /**
   * Triggered every 1s when `state.isPause` = true
   * Increment the `state.countPause`
   * Switch to the `countInterval`
   */
  incrementPause = () => {
    // Max value for `state.countPause`
    if (this.state.countPause >= this.state.totalPause) {
      new Audio('./assets/audio/notification.wav').play()
      this.stop()
      return this.start(true) // True to display the work notification
    }
    this.setState(prevState => ({
      countPause: prevState.countPause + 1
    }))
  }

  /**
   *  Work till the nearest hour
   */
  workTillNearestHour = () => {
    const date = new Date()
    const minutes = date.getMinutes() // i.e 32 (min)
    const seconds = date.getSeconds() // i.e 16 (sec)
    const secondsOfWork =
      (60 - minutes + this.state.workTillDelayedMinutes) * 60 - seconds

    // Get old values to restore them later
    const { total, numberOfCycle } = this.state

    this.setState({
      total: secondsOfWork,
      numberOfCycle: 1,
      shouldResetValues: {
        shouldReset: true,
        oldTotal: total,
        oldCycle: numberOfCycle
      }
    })

    // Start the counter, but it will automatically stop after `secondsOfWork` seconds
    this.start()
  }

  updateNextHour = value => {
    const date = new Date()

    date.setHours(date.getHours() + 1)

    let minutesValue
    if (value === undefined) {
      minutesValue = this.state.workTillDelayedMinutes
    } else {
      minutesValue = value
    }
    date.setMinutes(minutesValue)

    const nextHour = date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })

    this.setState({
      nextHour: nextHour
    })

    const [, minutes] = new Date().toLocaleTimeString().split(':') // i.e 32

    // Run again the next hour to update the UI
    this.updateNextHourInterval = setInterval(
      this.updateNextHour,
      1000 * 60 * (60 - minutes)
    )
  }

  /**
   *  Will revert old values after  `workTillNearestHour`
   */
  revertValues = () => {
    const { oldTotal, oldCycle } = this.state.shouldResetValues
    // Restore old values
    this.setState({
      total: oldTotal,
      numberOfCycle: oldCycle,
      shouldResetValues: {
        shouldReset: false
      }
    })
  }

  /**
   * Clear all intervals
   * Clear the state
   * Send `idle` event to the main process
   */
  stop = isManual => {
    clearInterval(this.countInterval)
    clearInterval(this.pauseInterval)

    clearTimeout(this.timeout25)
    clearTimeout(this.timeout50)
    clearTimeout(this.timeout75)
    clearTimeout(this.timeout90)

    this.setState({
      state: '',
      count: 0,
      countPause: 0
    })

    if (isManual && this.state.shouldResetValues.shouldReset) {
      this.revertValues()

      // Display the notification 'You finished the pomodoro'
      // If it's manual -> don't show
      window.ipcRenderer.send('finished', isManual)
    }

    if (isManual) {
      // Cancel the pausing timeout 'You must work during...'
      window.ipcRenderer.send('pausing', isManual)
    }

    window.ipcRenderer.send('idle')
  }

  resetTime = () => {
    this.setState({
      total: 1500,
      totalPause: 300,
      numberOfCycle: 0
    })
    window.ipcRenderer.send('updateConfig', {
      work: 1500,
      pause: 300,
      numberOfCycle: 0
    })
  }

  /**
   *  Set a new value for work time
   */
  setWork = minutes => {
    const seconds = parseInt(minutes) * 60
    if (!seconds) return
    this.setState({
      total: seconds
    })
  }

  /**
   *  Set a new value for pause time
   */
  setPause = minutes => {
    const seconds = parseInt(minutes) * 60
    if (!seconds) return
    this.setState({
      totalPause: seconds
    })
  }

  /**
   *  Set a new value for numberOfCycle
   */
  setNumberOfCycle = newValue => {
    if (newValue < 0) return
    this.setState({
      numberOfCycle: parseInt(newValue, 10)
    })
  }

  /**
   *  Set a new value for workTillDelayedMinutes
   */
  setWorkTillDelayedMinutes = newValue => {
    if (newValue < 0) return
    if (newValue > 59) return

    clearInterval(this.updateNextHourInterval)

    this.setState({
      workTillDelayedMinutes: parseInt(newValue, 10)
    })

    this.updateNextHour(parseInt(newValue, 10))
  }

  /**
   *  Show a confirmation dialog before quit the app
   */
  quit = () => {
    window.ipcRenderer.send('win-close')
  }

  finishedWelcome = () => {
    this.setState({
      finishedWelcome: true
    })
    localStorage.setItem('finishedWelcome', true)
  }

  render() {
    if (this.state.finishedWelcome) {
      return (
        <div className="container">
          <div
            className={`titlebar ${
              this.state.allowDrag ? 'is-draggable' : null
            }`}>
            <div
              className={`streak ${
                this.state.sessionStreak > 0 ? 'in-a-row' : ''
              }`}>
              <p>
                <span role="img" aria-label="fire streak">
                  🔥
                </span>
                {this.state.sessionStreak}
              </p>
            </div>

            <div className="controls">
              <i
                onClick={() => window.ipcRenderer.send('win-settings')}
                className="material-icons">
                settings
              </i>
              <i
                onClick={() => window.ipcRenderer.send('win-minimize')}
                className="material-icons">
                remove
              </i>
              <i onClick={this.quit} className="material-icons danger">
                close
              </i>
            </div>
          </div>

          <Counter {...this.state} />

          <h6
            onClick={this.workTillNearestHour}
            className={`sub-action ${this.state.state}`}
            style={{ marginTop: '300px' }}>
            Or work till {this.state.nextHour}.
          </h6>

          <Controls
            state={this.state.state}
            total={this.state.total}
            totalPause={this.state.totalPause}
            sessionStreak={this.state.sessionStreak}
            start={this.start}
            stop={this.stop}
            setWork={this.setWork}
            setPause={this.setPause}
            resetTime={this.resetTime}
            toggleCards={this.toggleCards}
            setNumberOfCycle={this.setNumberOfCycle}
            numberOfCycle={this.state.numberOfCycle}
            loadedConfig={this.state.loadedConfig}
            workTillDelayedMinutes={this.state.workTillDelayedMinutes}
            setWorkTillDelayedMinutes={this.setWorkTillDelayedMinutes}
          />
        </div>
      )
    } else {
      return <Welcome finishedWelcome={this.finishedWelcome} quit={this.quit} />
    }
  }
}

export default App
