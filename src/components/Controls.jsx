import React from 'react'

export default ({ isCounting, start, pause, reset }) => {
  return (
    <div className="controls">
      { !isCounting &&
        <button onClick={start}><i className="material-icons">play_arrow</i></button>
      }
      { isCounting &&
        <button onClick={pause}><i className="material-icons">pause</i></button>
      }
      <button onClick={reset}><i className="material-icons">stop</i></button>
    </div>
  )
}