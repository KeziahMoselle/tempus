import React from 'react'
import isElectron from '../../utils/isElectron'

function Header({ allowDrag, sessionStreak, winRestore, winCompact, quit }) {
  return (
    <div className={`titlebar ${allowDrag ? 'is-draggable' : null}`}>
      <div
        className={`streak hidden-on-compacted ${
          sessionStreak > 0 ? 'in-a-row' : ''
        }`}>
        <p>
          <span role="img" aria-label="fire streak">
            🔥
          </span>
          {sessionStreak}
        </p>
      </div>

      <div className="controls">
        <i
          onClick={() => window.ipcRenderer.send('win-settings')}
          className="material-icons hidden-on-compacted">
          settings
        </i>
        {isElectron && (
          <i
            onClick={() => window.ipcRenderer.send('win-minimize')}
            className="material-icons">
            remove
          </i>
        )}
        <i onClick={winRestore} className="material-icons remove-on-restored">
          call_made
        </i>
        <i onClick={winCompact} className="material-icons remove-on-compacted">
          call_received
        </i>
        {isElectron && (
          <i onClick={quit} className="material-icons danger">
            close
          </i>
        )}
      </div>
    </div>
  )
}

export default Header
