import React, { useState, useEffect } from 'react'
import EditTimer from './Footer/EditTimer'
import Statistics from './Footer/Statistics'

export default ({
  state,
  total, totalPause,
  start, stop,
  setWork, setPause, resetTime,
  sessionStreak,
  setNumberOfCycle, numberOfCycle,
  loadedConfig
}) => {
  // Is the footer full height or not ? (classname)
  const [isExtended, setIsExtended] = useState('')
  // Which component to display
  const [component, setComponent] = useState(null)
  // If a timer state has been changed
  const [isTimerChanged, setIsTimerChanged] = useState(false)

  const switchComponent = (name) => {
    setIsExtended('extended')
    if (name !== component) {
      setComponent(name)
    } else {
      setComponent(null)
      setIsExtended('')
    }
  }

  
  /**
   *  Save the new values to the config store
   *  Only when :
   *  - The user leave the EditTimer component
   *  - The config is loaded (local state is equal to the config store)
   *  - The user has changed values in the EditTimer component
   */
  useEffect(() => {
    if (component !== 'EditTimer' && loadedConfig && isTimerChanged) {
      window.ipcRenderer.send('updateConfig', {
        work: total,
        pause: totalPause,
        numberOfCycle: numberOfCycle
      })
      setIsTimerChanged(false)
    }
  }, [component, isTimerChanged])

  return (
    <footer className={isExtended}>

      <div className="footer-header">

        <button
          onClick={() => switchComponent('Statistics')}
          className={component === 'Statistics' ? 'active': ''}>
          <i className="material-icons">{ component !== 'Statistics' ? 'view_agenda' : 'close' }</i>
        </button>

        <button
          onClick={() => !state ? start() : stop(true)}
          className={`overlap ${state}`}>
          <i className="material-icons">{ !state ? 'play_arrow' : 'stop' }</i>
        </button>

        <button
          onClick={() => switchComponent('EditTimer')}
          className={component === 'EditTimer' ? 'active' : ''}>
          <i className="material-icons">{ component !== 'EditTimer' ? 'timer' : 'close' }</i>
        </button>

      </div>


      <div className="footer-content">

        { component === 'EditTimer' &&
          <EditTimer
            setWork={setWork}
            setPause={setPause}
            resetTime={resetTime}
            total={total}
            totalPause={totalPause}
            setNumberOfCycle={setNumberOfCycle}
            numberOfCycle={numberOfCycle}
            setIsTimerChanged={setIsTimerChanged}
          />
        }

        { component === 'Statistics' &&
          <Statistics sessionStreak={sessionStreak} />
        }

      </div>

    </footer>
  )
}
