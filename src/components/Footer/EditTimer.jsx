import React from 'react'

export default ({ setWork, setPause, resetTime, total, totalPause, setNumberOfCycle, numberOfCycle, setIsTimerChanged,
  workTillDelayedMinutes,
  setWorkTillDelayedMinutes
}) => (
  <div className="timer-container">
    <header>
      <h3>Preferences</h3>
      <button onClick={resetTime}>
        Reset
      </button>
    </header>

    <div className="card">
      <h3>Time</h3>

      <div className="field">
        <label htmlFor="work">Work time</label>
        <div className="has-suffix">
          <input
            onChange={(event) => {
              setWork(event.target.value)
              setIsTimerChanged(true)
            }}
            id="work"
            type="number"
            min="1"
            value={total / 60}
          />

          <div className="suffix">min</div>
        </div>
      </div>

      <div className="field">
        <label htmlFor="pause">Break time</label>
        <div className="has-suffix">
          <input
            onChange={(event) => {
              setPause(event.target.value)
              setIsTimerChanged(true)
            }}
            id="pause"
            type="number"
            min="1"
            value={totalPause / 60}
          />

          <div className="suffix">min</div>
        </div>
      </div>
    </div>

    <div className="card">
      <h3>Cycle</h3>

      <div className="field">
        <label htmlFor="cycle">Repeat</label>
        <div className="has-suffix">
          <input
            onChange={(event) => {
              setNumberOfCycle(event.target.value)
              setIsTimerChanged(true)
            }}
            id="cycle"
            type="number"
            min="0"
            value={numberOfCycle}
          />

          <div className="suffix">cycles</div>
        </div>
      </div>
    </div>

    <div className="card">
      <h3>Work till</h3>

      <div className="field">
        <label htmlFor="cycle">Add a delay</label>
        <div className="has-suffix">
          <input
            onChange={(event) => {
              setWorkTillDelayedMinutes(event.target.value)
              setIsTimerChanged(true)
            }}
            id="cycle"
            type="number"
            min="0"
            value={workTillDelayedMinutes}
          />

          <div className="suffix">min</div>
        </div>
      </div>
    </div>
    
  </div>
)