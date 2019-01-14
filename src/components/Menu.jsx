import React from 'react'

export default ({ toggleCards, cardsClass }) => (
  <div onClick={toggleCards} className={`cards ${cardsClass}`}>

    <div onClick={(e) => e.stopPropagation()} className="card green">
      <h2>Streak</h2>
      <i className="material-icons">check_circle</i>
    </div>

    <div onClick={(e) => e.stopPropagation()} className="card blue">
      <h2>Statistics</h2>
      <i className="material-icons">trending_up</i>
    </div>

  </div>
)