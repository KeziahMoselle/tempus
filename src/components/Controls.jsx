import React from 'react'

export default ({ state, start, pause, reset }) => {
  return (
    <div className="controls">
      { !state &&
        <button onClick={start}><i className="material-icons">play_arrow</i></button>
      }
      { state &&
        <button onClick={pause}><i className="material-icons">pause</i></button>
      }
      <button onClick={reset}><i className="material-icons">stop</i></button>
    </div>
  )
}