import React from 'react'

export default ({ toggleCards, cardsClass }) => (
  <div onClick={toggleCards} className={`cards ${cardsClass}`}>

    <div onClick={(e) => e.stopPropagation()} className="card">
      <header className="green">
        <h2>Streak</h2>
        <i className="material-icons">check_circle</i>
      </header>
      <main className="extended">
        <p>
          lorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem ipsu
        </p>
      </main>
    </div>

    <div onClick={(e) => e.stopPropagation()} className="card">
      <header className="blue">
        <h2>Statistics</h2>
        <i className="material-icons">trending_up</i>
      </header>
      <main>
        <p>
          lorem ipsum dolor sit ametlorem ipsum dolor sit ametlorem 
        </p>
      </main>
    </div>

  </div>
)