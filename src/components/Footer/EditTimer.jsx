import React from 'react'

export default ({ setWork, setPause, total, totalPause }) => (
  <ul>
    <li>
      <label htmlFor="work">Work</label>
      <input
        onChange={(event) => setWork(event.target.value)}
        id="work"
        type="number"
        min="1"
        value={total / 60}
      />
    </li>
    <li>
      <label htmlFor="pause">Pause</label>
      <input
        onChange={(event) => setPause(event.target.value)}
        id="pause"
        type="number"
        min="1"
        value={totalPause / 60}
      />
    </li>
  </ul>
)
