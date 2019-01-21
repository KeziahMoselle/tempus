import React, { useState } from 'react'
import EditTimer from './Footer/EditTimer'
import Statistics from './Footer/Statistics'

export default ({
  state,
  total, totalPause,
  start, stop,
  setWork, setPause
}) => {
  const [isExtended, setIsExtended] = useState(false)
  const [component, setComponent] = useState(null)

  const switchComponent = (name) => {
    setIsExtended('extended')
    if (name !== component) {
      setComponent(name)
    } else {
      setComponent(null)
      setIsExtended('')
    }
  }

  return (
    <footer className={isExtended}>

      <div className="navbar">

        <button
          onClick={() => switchComponent('Statistics')}
          className={component === 'Statistics' ? 'active': ''}>
          <i className="material-icons">{ component !== 'Statistics' ? 'view_agenda' : 'close' }</i>
        </button>

        <button
          onClick={() => !state ? start() : stop()}
          className={`overlap ${state}`}>
          <i className="material-icons">{ !state ? 'play_arrow' : 'stop' }</i>
        </button>

        <button
          onClick={() => switchComponent('EditTimer')}
          className={component === 'EditTimer' ? 'active' : ''}>
          <i className="material-icons">{ component !== 'EditTimer' ? 'timer' : 'close' }</i>
        </button>

      </div>


      <div className="menu">

        { component === 'EditTimer' &&
          <EditTimer
            setWork={setWork}
            setPause={setPause}
            total={total}
            totalPause={totalPause}
          />
        }

        { component === 'Statistics' &&
          <Statistics />
        }

      </div>

    </footer>
  )
}
