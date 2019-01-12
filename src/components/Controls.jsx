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
          <i className="material-icons">menu</i>
        </button>

      </div>

      <div className="menu">
        
      </div>

    </footer>
  )
}
