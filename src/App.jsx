import React, { Component } from 'react'
import Counter from './components/Counter'
import Controls from './components/Controls'
import Menu from './components/Menu/Menu'

class App extends Component {

  state = {
    state: null,
    total: 1500,
    count: 0,
    totalPause: 300,
    countPause: 0,
    sessionStreak: 0,
    cardsClass: undefined
  }

  componentDidMount () {
    // Listeners from the Tray menu
    window.ipcRenderer.on('start', this.start)
    window.ipcRenderer.on('stop', this.stop)
    // Send `handshake` event to receive new value from the store
    window.ipcRenderer.send('handshake')
    // Receive new values from the store
    window.ipcRenderer.on('updateValues', (event, data) => {
      this.setState({
        total: data.work,
        totalPause: data.pause
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
        sessionStreak: prevState.sessionStreak + 1
      }))
      window.ipcRenderer.send('updateStreak', this.state.sessionStreak)
      window.ipcRenderer.send('pausing')
      return this.pauseInterval = setInterval(this.incrementPause, 1000)
    }
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
      state: null,
      count: 0,
      countPause: 0
    })
    window.ipcRenderer.send('idle')
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
    window.ipcRenderer.send('updateStore', {
      work: seconds,
      pause: this.state.totalPause
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
    window.ipcRenderer.send('updateStore', {
      work: this.state.total,
      pause: seconds
    })
  }

  /**
   *  Toggle the menu cards
   */
  toggleCards = () => {
    if (!this.state.cardsClass) {
      this.setState({
        cardsClass: 'show'
      })
    } else {
      this.setState({
        cardsClass: undefined
      })
    }
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
          <div className="controls">
            <i onClick={() => window.ipcRenderer.send('win-minimize')} className="material-icons">remove</i>
            <i onClick={this.quit} className="material-icons danger">close</i>
          </div>
        </div>

        <Counter {...this.state} />

        <Menu
          cardsClass={this.state.cardsClass}
          toggleCards={this.toggleCards}
          sessionStreak={this.state.sessionStreak}
        />

        <Controls
          state={this.state.state}
          total={this.state.total}
          totalPause={this.state.totalPause}
          start={this.start}
          stop={this.stop}
          setWork={this.setWork}
          setPause={this.setPause}
          toggleCards={this.toggleCards}
        />
        
      </div>
    )
  }
}

export default App
