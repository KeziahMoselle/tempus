import React, { Component } from 'react'
import Counter from './components/Counter'
import Controls from './components/Controls'

class App extends Component {

  state = {
    state: '',
    total: 1500,
    count: 0,
    totalPause: 300,
    countPause: 0,
    numberOfCycle: 0,
    countCycle: 0,
    sessionStreak: 0,
    loadedConfig: false
  }

  componentDidMount () {
    // Listeners from the Tray menu
    window.ipcRenderer.on('start', this.start)
    window.ipcRenderer.on('stop', this.stop)
    // Send `handshake` event to receive new value from the store
    window.ipcRenderer.send('handshake')
    // Receive new values from the store
    window.ipcRenderer.on('handshake', (event, data) => {
      this.setState({
        total: data.work,
        totalPause: data.pause,
        sessionStreak: data.sessionStreak,
        numberOfCycle: data.numberOfCycle,
        loadedConfig: true
      })
    })
  }


  /**
   * Launch the counter
   * Creates the `countInterval` variable
   * Send `counting` event to the main process
   */
  start = () => {
    if (this.state.state === 'counting') return // If already counting return
    this.countInterval = setInterval(this.increment, 1000)
    this.setState({
      state: 'counting'
    })
    window.ipcRenderer.send('counting')
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
      if (this.state.numberOfCycle > 0 && (this.state.countCycle >= this.state.numberOfCycle)) {
        this.setState({
          countCycle: 0
        })
        return this.stop()
      }
      
      /* Streak */
      window.ipcRenderer.send('updateData', this.state.total / 60)
      /* Set pause state */
      window.ipcRenderer.send('pausing')
      /* Begin to count pause */
      return this.pauseInterval = setInterval(this.incrementPause, 1000)
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
    if (this.state.countPause >= this.state.totalPause) {
      // Max value for `state.countPause`
      // Switch into the `countInterval`
      this.stop()
      window.ipcRenderer.send('counting')
      return this.start()
    }
    this.setState(prevState => ({
      countPause: prevState.countPause + 1
    }))
  }

  /**
   * Clear all intervals
   * Clear the state
   * Send `idle` event to the main process
   */
  stop = () => {
    clearInterval(this.countInterval)
    clearInterval(this.pauseInterval)
    this.setState({
      state: '',
      count: 0,
      countPause: 0
    })
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
  setWork = (minutes) => {
    const seconds = parseInt(minutes)*60
    if (!seconds) return
    this.setState({
      total: seconds
    })
  }

  /**
   *  Set a new value for pause time
   */
  setPause = (minutes) => {
    const seconds = parseInt(minutes)*60
    if (!seconds) return
    this.setState({
      totalPause: seconds
    })
  }

  
  /**
   *  Set a new value for numberOfCycle
   */
  setNumberOfCycle = (newValue) => {
    if (newValue < 0) return
    this.setState({
      numberOfCycle: parseInt(newValue, 10)
    })
  }

  /**
   *  Show a confirmation dialog before quit the app
   */
  quit = () => {
    if (window.confirm('Do you really want to quit ?')) {
      window.ipcRenderer.send('win-close')
    }
  }

  render() {
    return (
      <div className="container">

        <div className="titlebar">
          <div className={`streak ${this.state.sessionStreak > 0 ? 'in-a-row' : ''}`}>
            <p>
              <span role="img" aria-label="fire streak">🔥</span>
              { this.state.sessionStreak }
            </p>
          </div>

          <div className="controls">
            <i onClick={() => window.ipcRenderer.send('win-minimize')} className="material-icons">remove</i>
            <i onClick={this.quit} className="material-icons danger">close</i>
          </div>
        </div>

        <Counter {...this.state} />

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
        />
        
      </div>
    )
  }
}

export default App
