import React from 'react'

export default ({ start, pause, reset }) => (
  <div>
    <button onClick={start}><i className="material-icons">play_arrow</i></button>
    <button onClick={pause}><i className="material-icons">pause</i></button>
    <button onClick={reset}><i className="material-icons">stop</i></button>
  </div>
)