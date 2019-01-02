import React, { Component } from 'react'
import Counter from './components/Counter'
import Controls from './components/Controls'

class App extends Component {
  constructor () {
    super()
    this.state = {
      isCounting: false,
      isPause: false,
      total: 1500,
      count: 0,
      totalPause: 300,
      countPause: 0 
    }

    window.ipcRenderer.on('start', this.start)
    window.ipcRenderer.on('reset', this.reset)
  }

  start = () => {
    if (this.state.isCounting) return
    this.countInterval = setInterval(this.increment, 1000)
    this.setState({
      isCounting: true
    })
    window.ipcRenderer.send('counting')
  }

  pause = () => {
    if (!this.state.isCounting) return
    clearInterval(this.countInterval)
    this.setState({
      isCounting: false
    })
    window.ipcRenderer.send('idle')
  }

  reset = () => {
    clearInterval(this.countInterval)
    clearInterval(this.pauseInterval)
    this.setState({
      isCounting: false,
      isPause: false,
      count: 0,
      countPause: 0
    })
    window.ipcRenderer.send('idle')
  }
  
  increment = () => {
    if (this.state.count >= this.state.total) {
      this.reset()
      this.setState({
        isPause: true
      })
      window.ipcRenderer.send('pausing')
      return this.pauseInterval = setInterval(this.incrementPause, 1000)
    }
    this.setState(prevState => ({
      count: prevState.count + 1
    }))
  }

  incrementPause = () => {
    if (this.state.countPause >= this.state.totalPause) {
      this.reset()
      window.ipcRenderer.send('counting')
      return this.start()
    }
    this.setState(prevState => ({
      countPause: prevState.countPause + 1
    }))
  }

  render() {
    return (
      <div className="container">
        { (this.state.isCounting || !this.state.isPause) &&
          <p className="mono">{this.state.total / 60} minutes</p>
        }
        { this.state.isPause &&
          <p className="mono">{this.state.totalPause / 60} minutes</p>
        }
        <Counter
          isCounting={this.state.isCounting}
          isPause={this.state.isPause}
          total={this.state.total}
          count={this.state.count}
          totalPause={this.state.totalPause}
          countPause={this.state.countPause}
        />
        <Controls
          isCounting={this.state.isCounting}
          start={this.start}
          pause={this.pause}
          reset={this.reset}
        />
      </div>
    )
  }
}

export default App
