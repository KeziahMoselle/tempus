import React, { Component } from 'react'
import Counter from './components/Counter'
import Controls from './components/Controls'

class App extends Component {
  constructor () {
    super()
    this.state = {
      start: false,
      countdown: 0
    }
  }

  start = () => {
    if (this.state.start) return
    this.countInterval = setInterval(this.increment, 1000)
    this.setState({
      start: true
    })
  }

  pause = () => {
    if (!this.state.start) return
    clearInterval(this.countInterval)
    this.setState({
      start: false
    })
  }

  reset = () => {
    clearInterval(this.countInterval)
    this.setState({
      start: false,
      countdown: 0
    })
  }
  
  increment = () => {
    this.setState(prevState => ({
      countdown: prevState.countdown + 1
    }))
  }

  render() {
    return (
      <div className="container">
        <Counter countdown={this.state.countdown} />
        <Controls
          state={this.state.start}
          start={this.start}
          pause={this.pause}
          reset={this.reset}
        />
      </div>
    )
  }
}

export default App
