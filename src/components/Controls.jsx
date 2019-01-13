import React, { useState, useEffect } from 'react'

export default ({ isCounting, start, pause, reset }) => {

  const [menu, setMenu] = useState(false)
  useEffect(() => {
    if (menu) {
      document.querySelector('footer').style.height = '248px'
    } else {
      document.querySelector('footer').style.height = '56px'
    }
  }, [menu])

  return (
    <footer>

      <div className="navbar">

        <button onClick={reset}>
          <i className="material-icons">stop</i>
        </button>

        <button onClick={() => !isCounting ? start() : pause()} className="overlap">
          <i className="material-icons">{ !isCounting ? 'play_arrow' : 'pause' }</i>
        </button>

        <button onClick={() => setMenu(!menu)}>
          <i className="material-icons">{ !menu ? 'menu' : 'close' }</i>
        </button>

      </div>

      <div className="menu">
        <ul>
          <li>
            <label for="work">Work</label>
            <input id="work" type="number" placeholder="25" />
          </li>
          <li>
            <label for="pause">Pause</label>
            <input id="pause" type="number" placeholder="5" />
          </li>
        </ul>
      </div>

    </footer>
  )
}
