import React from 'react'

export default ({ isCounting, start, pause, reset }) => {
  return (
    <div className="controls">
    <button onClick={reset} className="btn-danger"><i className="material-icons">stop</i></button>
      { !isCounting &&
        <button onClick={start} className="btn-primary"><i className="material-icons">play_arrow</i></button>
      }
      { isCounting &&
        <button onClick={pause} className="btn-primary"><i className="material-icons">pause</i></button>
      }
    </div>
  )
}