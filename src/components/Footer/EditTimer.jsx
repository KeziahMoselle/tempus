import React from 'react'

export default ({ setWork, setPause, resetTime, total, totalPause, setNumberOfCycle, numberOfCycle }) => (
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
        <label htmlFor="work">Work</label>
        <input
          onChange={(event) => setWork(event.target.value)}
          id="work"
          type="number"
          min="1"
          value={total / 60}
        />
      </div>

      <div className="field">
        <label htmlFor="pause">Pause</label>
        <input
          onChange={(event) => setPause(event.target.value)}
          id="pause"
          type="number"
          min="1"
          value={totalPause / 60}
        />
      </div>
    </div>

    <div className="card">
      <h3>Cycle {numberOfCycle === 0 ? '(disabled)' : ''}</h3>

      <div className="field">
        <label htmlFor="cycle">The number of cycle</label>
        <input
          onChange={(event) => setNumberOfCycle(event.target.value)}
          id="cycle"
          type="number"
          min="0"
          value={numberOfCycle}
        />
      </div>
    </div>
    
  </div>
)