import React from 'react'
import Card from './Card'

export default ({ toggleCards, cardsClass, sessionStreak }) => (
  <div onClick={toggleCards} className={`cards ${cardsClass}`}>

    <Card
      title="Streak"
      icon="check_circle"
      color="green"
      sessionStreak={sessionStreak}
    >
    </Card>

    <Card
      title="Statistics"
      icon="trending_up"
      color="blue"
    >
    </Card>

  </div>
)