import React from 'react'

export default ({ isCounting, start, pause, reset }) => (
  <footer>

    <div className="navbar">
      <button onClick={reset}><i className="material-icons">stop</i></button>
      <button onClick={() => !isCounting ? start() : pause()} className="overlap">
      <i className="material-icons">{ !isCounting ? 'play_arrow' : 'pause' }</i>
      </button>
      <button><i className="material-icons">more_vert</i></button>
    </div>

  </footer>
)