import React from 'react'

export default ({ isCounting, start, pause, reset }) => {
  return (
    <div className="controls">
    <button onClick={reset} className="btn-danger"><i className="material-icons">stop</i></button>
    
    
    <button onClick={() => !isCounting ? start() : pause()} className="btn-primary">
      <i className="material-icons">{ !isCounting ? 'play_arrow' : 'pause' }</i>
    </button>
    </div>
  )
}